import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GlassCard from "./ui/GlassCard";
import { Check, ChevronRight, ChevronLeft, Loader2, Sparkles, UserCircle } from "lucide-react";
import { getUser } from "../hooks/useAuth";
import PrakritiQuiz from "./assessment/PrakritiQuiz";
import DoshaReveal from "./assessment/DoshaReveal";
import VikritiAssessment from "./assessment/VikritiAssessment";

const AssessmentForm = ({ onComplete }) => {
    const user = getUser();
    const [stage, setStage] = useState("basic"); // basic, prakriti, dosha_reveal, vikriti
    const [loading, setLoading] = useState(false);
    const [language, setLanguage] = useState("en");

    const [formData, setFormData] = useState({
        age: "",
        gender: "",
        weight: "",
        height: "",
        prakriti: null, // { dominant, scores }
        vikriti: null, // includes imbalances, concern, severity, symptoms
    });

    const translations = {
        en: {
            title: "Personalized Assessment",
            subtitle: "Let's build your Ayurvedic profile in 4 simple stages.",
            stage1: "Stage 1: Basic Info",
            stage1desc: "Essential stats for accurate Dosha calculation",
            age: "Age",
            gender: "Gender",
            height: "Height",
            weight: "Weight",
            male: "Male",
            female: "Female",
            other: "Other",
            start: "Start Your Prakriti Quiz",
            analyzing: "AI is analyzing your profile...",
            analyzingDesc: "Generating your personalized Ayurvedic plan based on your Prakriti and current state.",
            select: "Select",
            precisionMode: "Expert-Verified Database",
            aiMode: "Dynamic AI Insights",
            mappingTitle: "Recommendations Source"
        },
        hi: {
            title: "व्यक्तिगत मूल्यांकन",
            subtitle: "आइए 4 सरल चरणों में आपका आयुर्वेदिक प्रोफाइल बनाएं।",
            stage1: "चरण 1: बुनियादी जानकारी",
            stage1desc: "सटीक दोष गणना के लिए आवश्यक आंकड़े",
            age: "आयु",
            gender: "लिंग",
            height: "ऊंचाई",
            weight: "वजन",
            male: "पुरुष",
            female: "महिला",
            other: "अन्य",
            start: "अपनी प्रकृति प्रश्नोत्तरी शुरू करें",
            analyzing: "एआई आपकी प्रोफाइल का विश्लेषण कर रहा है...",
            analyzingDesc: "आपकी प्रकृति और वर्तमान स्थिति के आधार पर आपकी व्यक्तिगत आयुर्वेदिक योजना तैयार की जा रही है।",
            select: "चुनें"
        },
        mr: {
            title: "वैयक्तिकृत मूल्यांकन",
            subtitle: "चला ४ सोप्या टप्प्यांत तुमचे आयुर्वेदिक प्रोफाईल तयार करूया.",
            stage1: "टप्पा १: मूलभूत माहिती",
            stage1desc: "अचूक दोष गणनेसाठी आवश्यक आकडेवारी",
            age: "वय",
            gender: "लिंग",
            height: "उंची",
            weight: "वजन",
            male: "पुरुष",
            female: "स्त्री",
            other: "इतर",
            start: "तुमची प्रकृती चाचणी सुरू करा",
            analyzing: "AI तुमच्या प्रोफाईलचे विश्लेषण करत आहे...",
            analyzingDesc: "तुमची प्रकृती आणि सध्याच्या स्थितीवर आधारित तुमचा वैयक्तिक आयुर्वेदिक प्लॅन तयार केला जात आहे.",
            select: "निवडा"
        }
    };

    const t = translations[language];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePrakritiComplete = (prakritiResult, quizAnswers, selectedLanguage) => {
        setLanguage(selectedLanguage); // Update in case changed in quiz
        setFormData(prev => ({
            ...prev,
            prakriti: prakritiResult,
            prakritiAnswers: quizAnswers
        }));
        setStage("dosha_reveal");
    };

    const handleVikritiComplete = (vikritiData) => {
        setFormData(prev => ({ ...prev, vikriti: vikritiData }));
        // Since Vikriti now includes symptoms, we can submit directly
        submitFullAssessment(vikritiData);
    };

    const submitFullAssessment = async (vikritiData) => {
        setLoading(true);
        try {
            const payload = {
                userId: user?.id || 1,
                age: formData.age,
                gender: formData.gender,
                height: formData.height,
                weight: formData.weight,
                prakriti: formData.prakriti.dominant,
                prakriti_primary: formData.prakriti.prakriti_primary,
                prakriti_secondary: formData.prakriti.prakriti_secondary,
                prakritiScores: formData.prakriti.scores,
                language: language,

                // Imbalances
                vikriti: {
                    digestion: vikritiData.digestion,
                    sleep: vikritiData.sleep,
                    mood: vikritiData.mood,
                    energy: vikritiData.energy,
                    vata_pct: vikritiData.vata_pct || 0,
                    pitta_pct: vikritiData.pitta_pct || 0,
                    kapha_pct: vikritiData.kapha_pct || 0
                },

                // Concerns
                healthIssues: [vikritiData.mainConcern],
                severity: vikritiData.severity,
                symptoms: vikritiData.symptoms,
                allopathicMedicine: vikritiData.allopathicMedicine,

                // Additional mapping
                mode: "ai", // Enforce AI/RAG Mode
                lifestyle: `Age: ${formData.age}, Gender: ${formData.gender}`,
                agni: vikritiData.digestion,
                mind: vikritiData.mood,
                mala: "Identified via detailed symptoms"
            };

            const res = await axios.post("http://localhost:5000/api/recommendations", payload);

            if (onComplete) {
                onComplete(res.data.recommendations);
            }
        } catch (error) {
            console.error("Assessment Failed", error);
            const errorMessage = error.response?.data?.message || "Something went wrong. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-2">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="relative">
                        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin" />
                        <Sparkles className="absolute -top-2 -right-2 text-amber-500 animate-pulse" />
                    </div>
                    <h2 className="text-2xl font-bold text-emerald-900">{t.analyzing}</h2>
                    <p className="text-slate-600">{t.analyzingDesc}</p>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    {stage === "basic" && (
                        <motion.div
                            key="basic"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="space-y-8"
                        >
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{t.title}</h2>
                                <p className="text-slate-500 font-medium italic">{t.subtitle}</p>

                                {/* Language Selector in Stage 1 */}
                                <div className="flex justify-center gap-2">
                                    {["en", "hi", "mr"].map((lang) => (
                                        <button
                                            key={lang}
                                            onClick={() => setLanguage(lang)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${language === lang
                                                ? "bg-emerald-600 border-emerald-700 text-white shadow-lg"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200"
                                                }`}
                                        >
                                            {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "मराठी"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <GlassCard className="max-w-xl mx-auto shadow-2xl overflow-hidden border-none p-0">
                                <div className="bg-emerald-600 p-6 text-white flex items-center gap-4">
                                    <div className="p-3 bg-white/20 rounded-2xl">
                                        <UserCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl uppercase tracking-wider">{t.stage1}</h3>
                                        <p className="text-emerald-50 text-xs">{t.stage1desc}</p>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input label={t.age} name="age" type="number" value={formData.age} onChange={handleChange} placeholder="Years" />
                                        <Select
                                            label={t.gender}
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            options={[t.male, t.female, t.other]}
                                            placeholder={t.select}
                                        />
                                        <Input label={t.height} name="height" type="number" value={formData.height} onChange={handleChange} placeholder="CM" />
                                        <Input label={t.weight} name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="KG" />
                                    </div>

                                    <button
                                        onClick={() => setStage("prakriti")}
                                        disabled={!formData.age || !formData.gender || !formData.height || !formData.weight}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl shadow-xl hover:bg-emerald-700 disabled:opacity-50 transition-all font-bold text-lg"
                                    >
                                        {t.start} <ChevronRight size={20} />
                                    </button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    )}

                    {stage === "prakriti" && (
                        <motion.div
                            key="prakriti"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <PrakritiQuiz
                                onComplete={handlePrakritiComplete}
                                initialLanguage={language}
                            />
                        </motion.div>
                    )}

                    {stage === "dosha_reveal" && (
                        <motion.div
                            key="dosha_reveal"
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -100 }}
                        >
                            <DoshaReveal
                                prakriti={formData.prakriti}
                                language={language}
                                onContinue={() => setStage("vikriti")}
                            />
                        </motion.div>
                    )}

                    {stage === "vikriti" && (
                        <motion.div
                            key="vikriti"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <VikritiAssessment
                                prakriti={formData.prakriti}
                                language={language}
                                onComplete={handleVikritiComplete}
                                onBack={() => setStage("dosha_reveal")}
                                initialData={formData.vikriti || {}}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </div>
    );
};

/* --- Helpers --- */
const Input = ({ label, ...props }) => (
    <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-emerald-800 uppercase pl-1 tracking-widest">{label}</label>
        <input {...props} className="border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 transition-all text-sm font-medium" />
    </div>
);

const Select = ({ label, options, ...props }) => (
    <div className="flex flex-col space-y-1.5">
        <label className="text-xs font-bold text-emerald-800 uppercase pl-1 tracking-widest">{label}</label>
        <select {...props} className="border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-slate-50/50 transition-all appearance-none cursor-pointer text-sm font-medium">
            <option value="">Select</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);

export default AssessmentForm;
