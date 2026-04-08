
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import GlassCard from "../components/ui/GlassCard";
import {
    Utensils,
    Activity,
    Youtube,
    Mic,
    Sparkles,
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle2
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getUser } from "../hooks/useAuth";
import axios from "axios";

const WellnessLab = () => {
    const user = getUser();
    const [activeTab, setActiveTab] = useState("nutrition");
    const [loading, setLoading] = useState(false);
    const [nutritionPlan, setNutritionPlan] = useState(null);
    const [yogaSequence, setYogaSequence] = useState(null);
    const [wellnessScore, setWellnessScore] = useState(0); // Mock score

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const res = await axios.post("http://localhost:5000/api/agents/wellness-score", { userId: user?.id });
                if (res.data.success) {
                    setWellnessScore(res.data.score);
                }
            } catch (err) {
                console.error(err);
            }
        };
        if (user?.id) fetchScore();
    }, [user]);

    const tabs = [
        { id: "nutrition", label: "AI Nutritionist", icon: Utensils, color: "text-orange-500", bg: "bg-orange-50" },
        { id: "yoga", label: "Yoga Sequencer", icon: Youtube, color: "text-red-500", bg: "bg-red-50" },
        { id: "tracker", label: "Wellness Tracker", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: "voice", label: "AyurVoice", icon: Mic, color: "text-blue-500", bg: "bg-blue-50" },
    ];

    const generateMealPlan = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/agents/nutritionist", { userId: user?.id });
            if (res.data.success) {
                setNutritionPlan(res.data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const buildYogaSequence = async () => {
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:5000/api/agents/yoga-sequencer", { userId: user?.id });
            if (res.data.success) {
                setYogaSequence(res.data.data.sequence);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [voiceResponse, setVoiceResponse] = useState("");
    const recognitionRef = useRef(null);

    const startListening = () => {
        // Stop any ongoing speech synth to clear the audio channel
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setVoiceResponse("");

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support speech recognition.");
            return;
        }

        if (isListening) {
            stopListening();
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        recognition.continuous = false; // Turn off continuous loop
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            console.log("Voice recognition started");
        };

        recognition.onend = () => {
            console.log("Voice recognition ended");
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
            if (event.error === 'not-allowed') {
                alert("Microphone access denied. Please allow microphone access in your browser settings.");
            }
            setIsListening(false);
        };

        recognition.onresult = async (event) => {
            const transcript = event.results[0][0].transcript;
            if (!transcript) return;

            // Stop listening immediately once we have a result
            stopListening();
            setLoading(true);

            try {
                const res = await axios.post("http://localhost:5000/api/chat", {
                    message: transcript,
                    userId: user?.id,
                    history: []
                });
                const aiMessage = res.data.response;
                setVoiceResponse(aiMessage);
                speak(aiMessage);
            } catch (err) {
                console.error("Chat API error:", err);
                setVoiceResponse("Error: Could not connect to the assistant.");
            } finally {
                setLoading(false);
            }
        };

        try {
            recognition.start();
        } catch (e) {
            console.error("Failed to start recognition:", e);
            setIsListening(false);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        setIsListening(false);
    };

    useEffect(() => {
        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = (text) => {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="min-h-screen bg-ayur-gradient font-sans">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 pt-28 pb-20">
                <header className="mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 mb-4"
                    >
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                            Experimental Features
                        </span>
                    </motion.div>
                    <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight">
                        Wellness <span className="text-emerald-600">Lab</span> 🔬
                    </h1>
                    <p className="text-slate-500 mt-3 text-lg max-w-2xl">
                        Explore advanced Ayurvedic AI agents designed to personalize your health journey beyond recommendations.
                    </p>
                </header>

                {/* Tab Navigation */}
                <div className="flex flex-wrap gap-4 mb-10">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 font-medium ${activeTab === tab.id
                                ? `${tab.bg} ${tab.color} shadow-md border border-white/50 scale-105`
                                : "bg-white/50 text-slate-500 hover:bg-white/80"
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Main Agent Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {activeTab === "nutrition" && (
                            <GlassCard className="border-orange-100 min-h-[500px] flex flex-col justify-center items-center text-center p-12">
                                <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center text-orange-600 mb-6">
                                    <Utensils size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Ayurvedic Nutritionist</h2>
                                <p className="text-slate-600 mb-8 max-w-lg">
                                    Generate a personalized daily meal plan based on your Prakriti and current health imbalances.
                                </p>

                                {!nutritionPlan ? (
                                    <button
                                        onClick={generateMealPlan}
                                        disabled={loading}
                                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-200 transition-all flex items-center gap-2"
                                    >
                                        {loading ? "Analyzing Gunas..." : "Generate My Meal Plan"}
                                        {!loading && <Sparkles size={18} />}
                                    </button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="w-full text-left bg-white/50 rounded-3xl p-8 border border-orange-100 space-y-6"
                                    >
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {[
                                                { label: "Breakfast", data: nutritionPlan.breakfast },
                                                { label: "Lunch", data: nutritionPlan.lunch },
                                                { label: "Dinner", data: nutritionPlan.dinner }
                                            ].map((meal, idx) => (
                                                <div key={idx} className="space-y-3">
                                                    <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">{meal.label}</span>
                                                    <div className="relative h-32 rounded-2xl overflow-hidden border border-orange-50 group bg-orange-100/30">
                                                        <img
                                                            src={`https://loremflickr.com/400/300/ayurvedic,dish,${meal.data.image_keyword || 'food'}`}
                                                            alt={meal.data.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                            onError={(e) => {
                                                                e.target.src = "https://images.unsplash.com/photo-1490645935967-10de6ba170a7?w=400&h=300&fit=crop";
                                                                e.target.onerror = null;
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                    </div>
                                                    <p className="text-slate-800 font-bold leading-tight">{meal.data.name}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-6 border-t border-orange-100">
                                            <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                                <TrendingUp size={16} className="text-emerald-600" /> Ayurvedic Note (Guna)
                                            </h4>
                                            <p className="text-slate-600 italic">"{nutritionPlan.guna}"</p>
                                        </div>
                                        <button
                                            onClick={() => setNutritionPlan(null)}
                                            className="text-orange-600 text-sm font-bold hover:underline"
                                        >
                                            Reset and Re-generate
                                        </button>
                                    </motion.div>
                                )}
                            </GlassCard>
                        )}

                        {activeTab === "yoga" && (
                            <GlassCard className="border-red-100 min-h-[500px] flex flex-col justify-center items-center text-center p-12">
                                <div className="w-20 h-20 bg-red-100 rounded-3xl flex items-center justify-center text-red-600 mb-6">
                                    <Youtube size={40} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Yoga Sequencer</h2>
                                <p className="text-slate-600 mb-8 max-w-lg">
                                    Create a custom 30-minute yoga playlist curated specifically for your dosha state.
                                </p>

                                {!yogaSequence ? (
                                    <button
                                        onClick={buildYogaSequence}
                                        disabled={loading}
                                        className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-red-200 transition-all flex items-center gap-2"
                                    >
                                        {loading ? "Sequencing..." : "Build My Custom Sequence"}
                                        {!loading && <ArrowRight size={18} />}
                                    </button>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full space-y-4 text-left"
                                    >
                                        {yogaSequence.map((item, i) => (
                                            <div key={i} className="bg-white/50 border border-red-50 p-5 rounded-3xl flex justify-between items-center group hover:bg-white transition-all shadow-sm hover:shadow-md">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 text-lg">{item.name}</h4>
                                                    <p className="text-sm text-slate-500 italic max-w-md">{item.reason}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="px-4 py-1.5 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                                                        {item.duration}
                                                    </span>
                                                    {item.video && (
                                                        <a
                                                            href={item.video}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-lg shadow-red-200"
                                                        >
                                                            <Youtube size={18} />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => setYogaSequence(null)}
                                            className="text-red-600 text-sm font-bold hover:underline mt-4"
                                        >
                                            Start Over
                                        </button>
                                    </motion.div>
                                )}
                            </GlassCard>
                        )}

                        {activeTab === "tracker" && (
                            <GlassCard className="border-emerald-100 min-h-[500px] p-12">
                                <div className="flex justify-between items-start mb-12">
                                    <div>
                                        <h2 className="text-3xl font-bold text-slate-900 mb-2">Health Tracking</h2>
                                        <p className="text-slate-500">Your wellness progress over time.</p>
                                    </div>
                                    <div className="bg-emerald-50 p-4 rounded-2xl text-center">
                                        <span className="block text-4xl font-bold text-emerald-600">{wellnessScore}</span>
                                        <span className="text-[10px] font-bold text-emerald-700 uppercase">Wellness Score</span>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 mb-12">
                                    <div className="p-8 bg-white/40 rounded-3xl border border-emerald-100 shadow-sm">
                                        <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg">
                                            <CheckCircle2 size={22} className="text-emerald-600" /> Daily Vihara (Checklist)
                                        </h4>
                                        <div className="space-y-4">
                                            {[
                                                { id: 1, label: "Morning Warm Water", points: 5 },
                                                { id: 2, label: "15-min Yoga/Pranayama", points: 15 },
                                                { id: 3, label: "Herbal Decoction (Kadha)", points: 10 },
                                                { id: 4, label: "Early Dinner (Sattvic)", points: 10 }
                                            ].map((task) => (
                                                <button
                                                    key={task.id}
                                                    onClick={() => setWellnessScore(prev => Math.min(prev + 5, 100))}
                                                    className="w-full p-4 bg-white/60 border border-emerald-50 rounded-2xl flex justify-between items-center hover:bg-emerald-50 transition-all group"
                                                >
                                                    <span className="font-medium text-slate-700">{task.label}</span>
                                                    <CheckCircle2 size={20} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-6 italic">Complete tasks to increase your wellness score in real-time.</p>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="p-8 bg-white/40 rounded-3xl border border-emerald-50 h-[45%]">
                                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <TrendingUp size={18} className="text-emerald-600" /> Consistency
                                            </h4>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                                                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${wellnessScore}%` }} />
                                            </div>
                                            <p className="text-sm text-slate-600 mt-4 font-medium">Progress: {wellnessScore}%</p>
                                        </div>

                                        <div className="p-8 bg-white/40 rounded-3xl border border-emerald-50 h-[45%]">
                                            <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <Clock size={18} className="text-orange-500" /> Routine Adherence
                                            </h4>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mt-4">
                                                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: '60%' }} />
                                            </div>
                                            <p className="text-sm text-slate-600 mt-4 leading-relaxed">Optimize your <span className="text-orange-600 font-bold uppercase text-xs">Dinacharya</span> (Daily Routine) for better alignment.</p>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        )}

                        {activeTab === "voice" && (
                            <GlassCard className="border-blue-100 min-h-[500px] flex flex-col justify-center items-center text-center p-12">
                                <motion.div
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-blue-400"
                                >
                                    <Mic size={40} />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">AyurVoice</h2>
                                <p className="text-slate-600 mb-8 max-w-lg">
                                    Hands-free mode. Speak to our AI to ask questions about your diet or get yoga guidance while practicing.
                                </p>
                                <button
                                    onClick={startListening}
                                    disabled={isListening || loading || isSpeaking}
                                    className={`px-8 py-4 rounded-2xl font-bold shadow-xl transition-all ${isListening ? "bg-red-500 animate-pulse" : isSpeaking ? "bg-emerald-500 animate-pulse" : "bg-slate-900 hover:bg-slate-800"} text-white`}
                                >
                                    {isListening ? "Listening... (Speak Now)" : isSpeaking ? "Speaking Response..." : loading ? "Processing..." : "Tap to Speak"}
                                </button>
                                {voiceResponse && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl text-left"
                                    >
                                        <p className="text-sm text-slate-700 leading-relaxed italic">
                                            "{voiceResponse}"
                                        </p>
                                    </motion.div>
                                )}
                            </GlassCard>
                        )}
                    </div>

                    {/* Side Info / Quick Links */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 rounded-[2rem] p-8 text-white">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles size={20} className="text-amber-400" /> Tip of the Day
                            </h3>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">
                                "Drinking warm water with ginger and lemon first thing in the morning can kickstart your Agni (digestive fire)."
                            </p>
                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-all">
                                Learn more about Agni
                            </button>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Recent Activity</h3>
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-slate-800">New recommendation</p>
                                            <p className="text-[10px] text-slate-500 uppercase">2 days ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default WellnessLab;
