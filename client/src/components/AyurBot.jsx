import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./ui/GlassCard";
import ReactMarkdown from "react-markdown";
import api, { API_BASE_URL } from "../services/api";

const AyurBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "model", text: "Namaste! I am AyurBot. Ask me anything about Ayurveda or Yoga, or I can help you book an appointment with our experts." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const botRef = useRef(null);

    // Get user from localStorage
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (botRef.current && !botRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    // Fetch history on mount
    useEffect(() => {
        if (user.id) {
            api.get(`/chat/history/${user.id}`)
                .then(res => {
                    if (res.data.success && res.data.history.length > 0) {
                        setMessages([
                            { role: "model", text: "Welcome back! Here is our previous conversation:" },
                            ...res.data.history
                        ]);
                    }
                })
                .catch(err => console.error("Error fetching history:", err));
        }
    }, [user.id]);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handlePay = async (appointmentId, amount) => {
        setLoading(true);
        try {
            const orderRes = await api.post("/payments/create-order", {
                amount,
                appointmentId
            });

            if (orderRes.data.success) {
                alert(`Proceeding to pay ₹${amount} for Appointment #${appointmentId}`);
                const verifyRes = await api.post("/payments/verify", {
                    appointmentId,
                    paymentId: "pay_" + Math.random().toString(36).substring(2, 10),
                    orderId: orderRes.data.orderId
                });

                if (verifyRes.data.success) {
                    setMessages(prev => [...prev, {
                        role: "model",
                        text: "✅ **Payment Successful!** Your appointment has been confirmed. You will receive a confirmation email with the meeting link shortly."
                    }]);
                }
            }
        } catch (error) {
            console.error("Payment failed", error);
            setMessages(prev => [...prev, { role: "model", text: "❌ Payment failed. Please try again or contact support." }]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", text: userMsg }]);
        setInput("");
        setLoading(true);

        let botMsg = { role: "model", text: "" };
        let botMessageStarted = false;
        const updateBotMessage = () => {
            if (!botMessageStarted) {
                botMessageStarted = true;
                setMessages(prev => [...prev, { ...botMsg }]);
                return;
            }

            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { ...botMsg };
                return newMsgs;
            });
        };

        try {
            const history = messages.slice(1).map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // Use fetch for streaming
            const response = await fetch(`${API_BASE_URL}/chat/stream`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMsg,
                    history: history,
                    userId: user.id
                })
            });

            if (!response.ok) throw new Error("Stream request failed");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const processLine = (line) => {
                if (!line.startsWith("data: ")) return false;

                const dataStr = line.slice(6).trim();
                if (dataStr === "[DONE]") return true;

                const data = JSON.parse(dataStr);
                if (data.error) {
                    botMsg.text = data.error;
                    updateBotMessage();
                } else if (data.chunk) {
                    botMsg.text += data.chunk;
                    updateBotMessage();
                }

                return false;
            };

            let pending = "";
            let streamFinished = false;

            while (!streamFinished) {
                const { done, value } = await reader.read();
                pending += decoder.decode(value || new Uint8Array(), { stream: !done });

                let newlineIndex = pending.indexOf("\n");
                while (newlineIndex !== -1) {
                    const line = pending.slice(0, newlineIndex).replace(/\r$/, "");
                    pending = pending.slice(newlineIndex + 1);
                    if (processLine(line)) {
                        streamFinished = true;
                        break;
                    }
                    newlineIndex = pending.indexOf("\n");
                }

                if (done) {
                    if (pending.trim()) processLine(pending.replace(/\r$/, ""));
                    break;
                }
            }

            if (!botMessageStarted) {
                botMsg.text = "AyurBot returned an empty response. Please try again.";
                updateBotMessage();
            }

            // Handle Payment Tag: [PAYMENT_REQUIRED:id:amount]
            const paymentMatch = botMsg.text.match(/\[PAYMENT_REQUIRED:(\d+):(\d+)\]/);
            if (paymentMatch) {
                const appointmentId = paymentMatch[1];
                const amount = paymentMatch[2];
                botMsg.text = botMsg.text.replace(/\[PAYMENT_REQUIRED:(\d+):(\d+)\]/, "").trim();
                botMsg.paymentInfo = { appointmentId, amount };
                updateBotMessage();
            }

        } catch (error) {
            console.error("AyurBot request failed:", error);
            botMsg.text = "I'm having trouble connecting right now. Please try again.";
            updateBotMessage();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50" ref={botRef}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="mb-4 w-80 md:w-96"
                    >
                        <GlassCard className="!p-0 overflow-hidden flex flex-col h-[500px] border-emerald-200">
                            {/* Header */}
                            <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
                                <h3 className="font-bold">AyurBot Assistant</h3>
                                <button onClick={toggleOpen}><X size={20} /></button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/50">
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === "user"
                                            ? "bg-emerald-600 text-white rounded-br-none"
                                            : "bg-white border border-emerald-100 text-slate-800 rounded-bl-none shadow-sm"
                                            }`}>
                                            <div className="markdown-content">
                                                <ReactMarkdown>{m.text}</ReactMarkdown>
                                                {m.paymentInfo && (
                                                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                                                        <p className="text-xs text-slate-600 mb-2">Booking confirmed! Please complete payment to secure your slot.</p>
                                                        <button
                                                            onClick={() => handlePay(m.paymentInfo.appointmentId, m.paymentInfo.amount)}
                                                            className="w-full py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 transition-colors"
                                                        >
                                                            Pay ₹{m.paymentInfo.amount} Now
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                                            <Loader2 className="animate-spin w-4 h-4 text-emerald-600" />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-white border-t border-emerald-100 flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                                    placeholder="Ask about remedies..."
                                    className="flex-1 border-none focus:ring-0 bg-slate-50 rounded-xl px-3 text-sm"
                                />
                                <button onClick={handleSend} disabled={loading} className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
                                    <Send size={18} />
                                </button>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={toggleOpen}
                    className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full shadow-lg flex items-center justify-center hover:shadow-emerald-200/50"
                >
                    <MessageSquare size={28} />
                </motion.button>
            )}
        </div>
    );
};

export default AyurBot;
