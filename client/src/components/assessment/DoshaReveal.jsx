import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Flame, Droplets } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const DoshaReveal = ({ prakriti, onContinue, language = "en" }) => {
    const { dominant, scores } = prakriti;

    const translations = {
        en: {
            identified: "Your Prakriti is Identified!",
            traits: "Based on your traits, your natural constitution is predominantly:",
            vataDesc: "The energy of movement. You are likely creative, energetic, and light-hearted when balanced.",
            pittaDesc: "The energy of transformation. You are likely focused, ambitious, and intelligent with a strong willpower.",
            kaphaDesc: "The energy of structure. You are likely grounded, calm, and loyal with a strong physical build.",
            imbalance: "Now that we know your natural state, let's identify any current imbalances to provide personalized recommendations.",
            continue: "Continue to Current State Assessment",
            videoTitle: "Understand Your Prakriti",
            videoDesc: "To understand your Prakriti and learn about your guide, watch the video below.",
            vata: "Vata",
            pitta: "Pitta",
            kapha: "Kapha"
        },
        hi: {
            identified: "आपकी प्रकृति की पहचान हो गई है!",
            traits: "आपके लक्षणों के आधार पर, आपका स्वरूप मुख्य रूप से है:",
            vataDesc: "गति की ऊर्जा। संतुलित होने पर आप रचनात्मक, ऊर्जावान और प्रसन्नचित्त होते हैं।",
            pittaDesc: "परिवर्तन की ऊर्जा। आप केंद्रित, महत्वाकांक्षी और मजबूत इच्छाशक्ति वाले बुद्धिमान व्यक्ति हैं।",
            kaphaDesc: "संरचना की ऊर्जा। आप मजबूत शारीरिक गठन के साथ शांत और वफादार हैं।",
            imbalance: "अब जब हम आपकी प्राकृतिक स्थिति को जानते हैं, तो आइए व्यक्तिगत अनुशंसाएं प्रदान करने के लिए किसी भी वर्तमान असंतुलन की पहचान करें।",
            continue: "वर्तमान स्थिति मूल्यांकन जारी रखें",
            videoTitle: "अपनी प्रकृति को समझें",
            videoDesc: "अपनी प्रकृति को समझने और अपने गाइड के बारे में जानने के लिए नीचे दिया गया वीडियो देखें।",
            vata: "वात",
            pitta: "पित्त",
            kapha: "कफ"
        },
        mr: {
            identified: "तुमची प्रकृती ओळखली गेली आहे!",
            traits: "तुमच्या वैशिष्ट्यांवरून, तुमचे नैसर्गिक स्वरूप प्रामुख्याने असे आहे:",
            vataDesc: "हालचालीची ऊर्जा. संतुलित असताना तुम्ही सर्जनशील, उत्साही आणि आनंदी असता.",
            pittaDesc: "परिवर्तनाची ऊर्जा. तुम्ही एकाग्र, महत्त्वाकांक्षी आणि प्रबळ इच्छाशक्ती असलेले बुद्धिमान व्यक्ती आहात.",
            kaphaDesc: "संरचनेची ऊर्जा. तुम्ही मजबूत शरीरयष्टीसह शांत आणि एकनिष्ठ व्यक्ती आहात.",
            imbalance: "आता आपल्याला तुमची नैसर्गिक स्थिती माहित आहे, चला वैयक्तिकृत शिफारसी प्रदान करण्यासाठी कोणतीही वर्तमान असंतुलन ओळखूया.",
            continue: "सध्याची स्थिती मूल्यमापन सुरू ठेवा",
            videoTitle: "तुमची प्रकृती समजून घ्या",
            videoDesc: "तुमची प्रकृती समजून घेण्यासाठी आणि तुमच्या मार्गदर्शकाबद्दल जाणून घेण्यासाठी खालील व्हिडिओ पहा.",
            vata: "वात",
            pitta: "पित्त",
            kapha: "कफ"
        }
    };

    const t = translations[language];

    const doshaInfo = {
        Vata: {
            name: t.vata,
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200",
            icon: <Zap className="text-blue-500" size={32} />,
            description: t.vataDesc
        },
        Pitta: {
            name: t.pitta,
            color: "text-red-600",
            bg: "bg-red-50",
            border: "border-red-200",
            icon: <Flame className="text-red-500" size={32} />,
            description: t.pittaDesc
        },
        Kapha: {
            name: t.kapha,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            icon: <Droplets className="text-emerald-500" size={32} />,
            description: t.kaphaDesc
        }
    };

    const info = doshaInfo[dominant];

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const sortedScores = Object.entries(scores)
        .sort(([, a], [, b]) => b - a)
        .map(([name, score]) => ({
            name,
            score,
            percentage: totalScore > 0 ? Math.round((score / totalScore) * 100) : 0,
            ...doshaInfo[name]
        }));

    const primary = sortedScores[0];
    const secondary = sortedScores[1];
    const tertiary = sortedScores[2];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-3xl mx-auto text-center space-y-8 py-10"
        >
            <div className="space-y-2">
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="inline-block"
                >
                    <Sparkles className="text-amber-500 mx-auto" size={48} />
                </motion.div>
                <h2 className="text-3xl font-extrabold text-slate-900">{t.identified}</h2>
                <p className="text-slate-600">{t.traits}</p>
            </div>

            <GlassCard className={`${primary.bg} ${primary.border} border-2 shadow-2xl`}>
                <div className="flex flex-col items-center gap-4 py-6">
                    <div className="p-4 bg-white rounded-2xl shadow-inner">
                        {primary.icon}
                    </div>
                    <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Predominant Dosha</span>
                        <h1 className={`text-6xl font-black uppercase tracking-tighter ${primary.color}`}>
                            {primary.name}
                        </h1>
                    </div>
                    <p className="text-lg text-slate-700 max-w-lg font-medium leading-relaxed px-6">
                        {primary.description}
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 px-8 pb-8">
                    {sortedScores.map((ds, idx) => (
                        <div key={ds.name} className="bg-white/50 p-4 rounded-3xl border border-white/50 space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="text-left">
                                    <span className="text-[9px] font-black text-slate-400 uppercase block tracking-wider">
                                        {idx === 0 ? "Primary" : idx === 1 ? "Secondary" : "Tertiary"}
                                    </span>
                                    <span className={`text-sm font-bold ${ds.color}`}>{ds.name}</span>
                                </div>
                                <span className={`text-lg font-black ${ds.color}`}>{ds.percentage}%</span>
                            </div>
                            <div className="h-2.5 bg-white rounded-full overflow-hidden border border-slate-100 shadow-inner">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${ds.percentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className={`h-full ${ds.bg.replace('50', '500')}`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>

            <div className="space-y-6 pt-4">
                <div className="space-y-4">
                    <p className="text-sm text-slate-500 italic">
                        {t.imbalance}
                    </p>
                    <button
                        onClick={onContinue}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-xl hover:bg-emerald-700 hover:-translate-y-1 transition-all"
                    >
                        {t.continue} <ArrowRight size={20} />
                    </button>
                </div>

                {/* Prakriti Analysis & Vikriti Guide Video Section */}
                <div className="mt-12 space-y-4">
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-900">{t.videoTitle}</h3>
                        <p className="text-sm text-slate-500">{t.videoDesc}</p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="overflow-hidden rounded-3xl border border-slate-200 shadow-2xl bg-black aspect-video relative group"
                    >
                        <video
                            controls
                            className="w-full h-full object-cover"
                            id="prakriti-video"
                            playsInline
                        >
                            <source src="/images/logos/Video after Prakriti Assessment and Vikriti Guide - Made with Clipchamp.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default DoshaReveal;
