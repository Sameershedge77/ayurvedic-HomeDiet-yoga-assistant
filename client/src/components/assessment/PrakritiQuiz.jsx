import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Info, HelpCircle } from "lucide-react";
import GlassCard from "../ui/GlassCard";
import { prakritiQuestions } from "../../data/prakritiData";

const PrakritiQuiz = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [bmiData, setBmiData] = useState({ height: "", weight: "", age: "" });
    const [calculatedBmi, setCalculatedBmi] = useState(null);
    const [language, setLanguage] = useState("en");

    const currentQuestion = prakritiQuestions[currentStep];

    const translations = {
        en: {
            title: "Identify Your Prakriti",
            back: "Back",
            next: "Next",
            finish: "Finish Quiz",
            bestFit: "Choose the best fit:",
            bmi: "BMI",
            age: "Age",
            height: "Ht(cm)",
            weight: "Wt(kg)"
        },
        hi: {
            title: "अपनी प्रकृति की पहचान करें",
            back: "पीछे",
            next: "अगला",
            finish: "प्रश्नोत्तरी समाप्त करें",
            bestFit: "सबसे उपयुक्त चुनें:",
            bmi: "बीएमआई",
            age: "आयु",
            height: "ऊंचाई (cm)",
            weight: "वजन (kg)"
        },
        mr: {
            title: "तुमची प्रकृती ओळखा",
            back: "मागे",
            next: "पुढील",
            finish: "चाचणी पूर्ण करा",
            bestFit: "सर्वात योग्य पर्याय निवडा:",
            bmi: "बीएमआई",
            age: "वय",
            height: "उंची (cm)",
            weight: "वजन (kg)"
        }
    };

    const t = translations[language];

    useEffect(() => {
        if (bmiData.height && bmiData.weight) {
            const hMetres = bmiData.height / 100;
            const bmi = bmiData.weight / (hMetres * hMetres);
            setCalculatedBmi(bmi.toFixed(1));

            // Auto-select based on BMI for Q1
            if (currentStep === 0) {
                let optionId = "B";
                if (bmi < 18.5) optionId = "A";
                else if (bmi >= 25) optionId = "C";
                handleSelect(optionId);
            }
        }
    }, [bmiData]);

    const handleSelect = (optionId) => {
        setAnswers({ ...answers, [currentQuestion.id]: optionId });
    };

    const nextStep = () => {
        if (currentStep < prakritiQuestions.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            const result = calculateDosha(answers);
            onComplete(result, answers, language);
        }
    };

    const prevStep = () => setCurrentStep(prev => Math.max(0, prev - 1));

    const calculateDosha = (finalAnswers) => {
        const scores = { Vata: 0, Pitta: 0, Kapha: 0 };
        prakritiQuestions.forEach(q => {
            const answerId = finalAnswers[q.id];
            const option = q.options.find(o => o.id === answerId);
            if (option) {
                scores.Vata += option.score.Vata;
                scores.Pitta += option.score.Pitta;
                scores.Kapha += option.score.Kapha;
            }
        });

        // Get sorted doshas by score
        const sortedDoshas = Object.entries(scores)
            .sort(([, a], [, b]) => b - a);

        const primary = sortedDoshas[0][0];
        const secondary = sortedDoshas[1][0];

        return {
            dominant: primary, // keep for backward compatibility
            prakriti_primary: primary.toLowerCase(),
            prakriti_secondary: secondary.toLowerCase(),
            scores
        };
    };

    const progress = ((currentStep + 1) / prakritiQuestions.length) * 100;

    return (
        <div className="space-y-4 max-w-5xl mx-auto">
            {/* Progress Header - More compact */}
            <div className="flex flex-wrap justify-between items-center gap-4 px-2">
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs">
                        {currentStep + 1} / {prakritiQuestions.length}
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 hidden sm:block">{t.title}</h3>
                </div>

                {/* Language Selector */}
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
                    {["en", "hi", "mr"].map((lang) => (
                        <button
                            key={lang}
                            onClick={() => setLanguage(lang)}
                            className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${language === lang
                                ? "bg-white text-emerald-600 shadow-sm"
                                : "text-slate-500 hover:text-emerald-500"
                                }`}
                        >
                            {lang === "en" ? "English" : lang === "hi" ? "हिंदी" : "मराठी"}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-4 lg:ml-auto">
                    <div className="w-32 sm:w-48 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-emerald-500"
                        />
                    </div>
                    <span className="text-xs font-bold text-emerald-700">{Math.round(progress)}%</span>
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    <GlassCard className="p-0 overflow-hidden border-none shadow-xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                            {/* Left Side: Visual Content */}
                            <div className="bg-emerald-50/30 p-6 flex flex-col justify-center border-b md:border-b-0 md:border-r border-emerald-100/50">
                                <div className="mb-4">
                                    <h2 className="text-xl sm:text-2xl font-bold text-emerald-900 leading-tight">
                                        {currentQuestion.question[language]}
                                    </h2>
                                    {currentQuestion.note && (
                                        <p className="mt-2 text-xs text-emerald-700 flex items-start gap-1.5 italic font-medium">
                                            <Info size={14} className="shrink-0 mt-0.5" />
                                            {currentQuestion.note[language]}
                                        </p>
                                    )}
                                </div>

                                {currentQuestion.requiresBMI && (
                                    <div className="mb-4 p-3 bg-white/60 rounded-xl border border-emerald-100 flex flex-wrap gap-3 items-end">
                                        <BmiInput label={t.age} value={bmiData.age} onChange={(v) => setBmiData(prev => ({ ...prev, age: v }))} className="w-16" />
                                        <BmiInput label={t.height} value={bmiData.height} onChange={(v) => setBmiData(prev => ({ ...prev, height: v }))} className="w-20" />
                                        <BmiInput label={t.weight} value={bmiData.weight} onChange={(v) => setBmiData(prev => ({ ...prev, weight: v }))} className="w-20" />
                                        {calculatedBmi && (
                                            <div className="pb-1">
                                                <span className="text-[10px] font-bold text-emerald-600 uppercase block">{t.bmi}</span>
                                                <span className="text-sm font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-md">{calculatedBmi}</span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {currentQuestion.image && (
                                    <div className="relative rounded-xl overflow-hidden shadow-lg aspect-video md:aspect-auto md:flex-grow max-h-[250px] md:max-h-none">
                                        <img
                                            src={currentQuestion.image}
                                            alt="Visual aid"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Options */}
                            <div className="p-6 flex flex-col h-full">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">{t.bestFit}</p>
                                <div className="space-y-3 flex-grow">
                                    {currentQuestion.options.map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleSelect(opt.id)}
                                            className={`w-full flex items-center p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${answers[currentQuestion.id] === opt.id
                                                ? "bg-emerald-600 border-emerald-700 text-white shadow-md scale-[1.01]"
                                                : "bg-white border-slate-100 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50/20"
                                                }`}
                                        >
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-3 shrink-0 ${answers[currentQuestion.id] === opt.id
                                                ? "bg-white text-emerald-600"
                                                : "bg-emerald-100 text-emerald-700"
                                                }`}>
                                                {opt.id}
                                            </div>
                                            <span className="text-sm sm:text-base font-medium leading-tight">{opt.text[language]}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Controls inside the card for better flow */}
                                <div className="mt-8 flex justify-between gap-4">
                                    <button
                                        onClick={prevStep}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${currentStep === 0 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:bg-slate-100"}`}
                                    >
                                        <ChevronLeft size={18} className="inline mr-1" /> {t.back}
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={!answers[currentQuestion.id]}
                                        className={`px-6 py-2 rounded-xl font-bold text-sm shadow-lg transition-all ${!answers[currentQuestion.id]
                                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                                            }`}
                                    >
                                        {currentStep === prakritiQuestions.length - 1 ? t.finish : t.next} <ChevronRight size={18} className="inline ml-1" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

const BmiInput = ({ label, value, onChange, className }) => (
    <div className={className}>
        <label className="text-[10px] font-bold text-emerald-800 uppercase block pl-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-xs px-2 py-1.5 rounded-lg border border-emerald-200 bg-white/80 focus:ring-1 focus:ring-emerald-500 outline-none"
        />
    </div>
);

export default PrakritiQuiz;
