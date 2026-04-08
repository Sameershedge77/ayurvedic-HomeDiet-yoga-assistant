import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, AlertCircle, MessageSquare, ShieldAlert } from "lucide-react";
import GlassCard from "../ui/GlassCard";

const VikritiAssessment = ({ prakriti, onComplete, onBack, initialData = {}, language = "en" }) => {
    const [answers, setAnswers] = useState({
        digestion: initialData.digestion || "",
        sleep: initialData.sleep || "",
        mood: initialData.mood || "",
        energy: initialData.energy || "",
        mainConcern: initialData.mainConcern || "",
        severity: initialData.severity || "Moderate",
        symptoms: initialData.symptoms || "",
        allopathicMedicine: initialData.allopathicMedicine || ""
    });

    const translations = {
        en: {
            title: "Current State (Vikriti)",
            subtitle: "How are you feeling lately?",
            naturalType: "Your natural type is",
            identifyImbalance: "Let's identify any current imbalances.",
            digestionLabel: "Recent Digestion",
            sleepLabel: "Recent Sleep",
            moodLabel: "Current Mood",
            energyLabel: "Energy Level",
            heavy: "Feeling heavy/slow after meals",
            acidic: "Occasional acidity/burning",
            gas: "Frequent gas/bloating",
            normal: "Feeling light/regular",
            insomnia: "Difficulty falling asleep",
            frequentWake: "Waking up frequently",
            oversleeping: "Feeling sluggish/oversleeping",
            restful: "Sleeping well",
            anxious: "Worried or restless",
            irritable: "Angry or impatient",
            low: "Unmotivated or low",
            balanced: "Calm and focused",
            constantFatigue: "Low energy all day",
            bursts: "Highs followed by crashes",
            afternoonDip: "Strong afternoon dip",
            stable: "Consistent energy",
            healthConcerns: "Your Specific Health Concerns",
            mainConcern: "Main Concern",
            concernPlaceholder: "e.g. Back Pain, Anxiety...",
            severity: "Severity",
            mild: "Mild",
            moderate: "Moderate",
            severe: "Severe",
            describeSymptoms: "Describe detailed symptoms",
            symptomsPlaceholder: "When did it start? What makes it better or worse?",
            allopathicMedicineLabel: "Current Allopathic Medications",
            allopathicMedicinePlaceholder: "e.g. Metformin for diabetes, BP meds...",
            submitNote: "Complete all fields above to enable AI analysis. This information is used to generate your personalized Ayurvedic plan.",
            back: "Back to Prakriti result",
            analyze: "Analyze with AI"
        },
        hi: {
            title: "वर्तमान स्थिति (विकृति)",
            subtitle: "आप हाल ही में कैसा महसूस कर रहे हैं?",
            naturalType: "आपका प्राकृतिक प्रकार है",
            identifyImbalance: "आइए किसी भी वर्तमान असंतुलन की पहचान करें।",
            digestionLabel: "हाल ही में पाचन",
            sleepLabel: "हाल ही में नींद",
            moodLabel: "वर्तमान मनोदशा",
            energyLabel: "ऊर्जा का स्तर",
            heavy: "भोजन के बाद भारीपन/सुस्ती महसूस होना",
            acidic: "कभी-कभी अम्लता/जलन",
            gas: "बार-बार गैस/सूजन",
            normal: "हल्का/नियमित महसूस होना",
            insomnia: "सोने में कठिनाई",
            frequentWake: "बार-बार जागना",
            oversleeping: "सुस्ती महसूस करना/ज़्यादा सोना",
            restful: "अच्छी नींद आना",
            anxious: "चिंतित या बेचैन",
            irritable: "क्रोधित या अधीर",
            low: "अनुत्साहित या कम महसूस करना",
            balanced: "शांत और केंद्रित",
            constantFatigue: "पूरे दिन कम ऊर्जा",
            bursts: "उछाल के बाद गिरावट",
            afternoonDip: "दोपहर में ऊर्जा की भारी कमी",
            stable: "लगातार ऊर्जा",
            healthConcerns: "आपकी विशिष्ट स्वास्थ्य चिंताएं",
            mainConcern: "मुख्य चिंता",
            concernPlaceholder: "जैसे - पीठ दर्द, चिंता...",
            severity: "गंभीरता",
            mild: "हल्का",
            moderate: "मध्यम",
            severe: "गंभीर",
            describeSymptoms: "विस्तृत लक्षणों का वर्णन करें",
            symptomsPlaceholder: "यह कब शुरू हुआ? इसे क्या बेहतर या बदतर बनाता है?",
            allopathicMedicineLabel: "वर्तमान एलोपैथिक दवाएं",
            allopathicMedicinePlaceholder: "जैसे - मधुमेह के लिए मेटफोर्मिन, बीपी की दवाएं...",
            submitNote: "एआई विश्लेषण सक्षम करने के लिए ऊपर के सभी क्षेत्र भरें। इस जानकारी का उपयोग आपकी व्यक्तिगत आयुर्वेदिक योजना बनाने के लिए किया जाता है।",
            back: "प्रकृति परिणाम पर वापस जाएं",
            analyze: "एआई के साथ विश्लेषण करें"
        },
        mr: {
            title: "सद्याची स्थिती (विकृती)",
            subtitle: "तुम्हाला अलीकडे कसे वाटत आहे?",
            naturalType: "तुमचा नैसर्गिक प्रकार आहे",
            identifyImbalance: "चला कोणतीही वर्तमान असंतुलन ओळखूया.",
            digestionLabel: "अलीकडचे पचन",
            sleepLabel: "अलीकडची झोप",
            moodLabel: "सध्याची मनःस्थिती",
            energyLabel: "ऊर्जा पातळी",
            heavy: "जेवणानंतर जडपणा/सुस्ती वाटणे",
            acidic: "कधीकधी ॲसिडिटी/जळजळ",
            gas: "वारंवार गॅस/फुगणे",
            normal: "हलके/नियमित वाटणे",
            insomnia: "झोप लागण्यास त्रास होणे",
            frequentWake: "वारंवार जाग येणे",
            oversleeping: "सुस्ती वाटणे/जास्त झोपणे",
            restful: "चांगली झोप येणे",
            anxious: "काळजी वाटणे किंवा अस्वस्थता",
            irritable: "रागीट किंवा अधीर",
            low: "अनुत्साहित किंवा कमी वाटणे",
            balanced: "शांत आणि एकाग्र",
            constantFatigue: "दिवसभर कमी ऊर्जा",
            bursts: "उल्हासांनंतर थकवा जाणवणे",
            afternoonDip: "दुपारी ऊर्जेची मोठी कमतरता",
            stable: "सातत्यपूर्ण ऊर्जा",
            healthConcerns: "तुमच्या विशिष्ट आरोग्य समस्या",
            mainConcern: "मुख्य समस्या",
            concernPlaceholder: "उदा. पाठदुखी, चिंता...",
            severity: "तीव्रता",
            mild: "सौम्य",
            moderate: "मध्यम",
            severe: "तीव्र",
            describeSymptoms: "सविस्तर लक्षणांचे वर्णन करा",
            symptomsPlaceholder: "ते केव्हा सुरू झाले? कशामुळे ते बरे वाटते किंवा बिघडते?",
            allopathicMedicineLabel: "सध्याची एलोपॅथी औषधे",
            allopathicMedicinePlaceholder: "उदा. मधुमेहासाठी मेटफॉर्मिन, बीपीची औषधे...",
            submitNote: "AI विश्लेषण सक्षम करण्यासाठी वरील सर्व फील्ड भरा. ही माहिती तुमची वैयक्तिकृत आयुर्वेदिक योजना तयार करण्यासाठी वापरली जाते.",
            back: "प्रकृती निकालावर परत जा",
            analyze: "AI सह विश्लेषण करा"
        }
    };

    const t = translations[language];

    const handleSelect = (field, value) => {
        setAnswers(prev => ({ ...prev, [field]: value }));
    };

    const handleChange = (e) => {
        setAnswers(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const isImbalanceComplete = answers.digestion && answers.sleep && answers.mood && answers.energy;
    const isSymptomComplete = answers.mainConcern && answers.symptoms;
    const isComplete = isImbalanceComplete && isSymptomComplete;

    const calculateVikritiPercentages = () => {
        const mapping = {
            digestion: { vata: "gas", pitta: "acidic", kapha: "heavy" },
            sleep: { vata: "insomnia", pitta: "frequent-wake", kapha: "oversleeping" },
            mood: { vata: "anxious", pitta: "irritable", kapha: "low" },
            energy: { vata: "bursts", pitta: "afternoon-dip", kapha: "constant-fatigue" }
        };

        let vataPoints = 0;
        let pittaPoints = 0;
        let kaphaPoints = 0;

        Object.keys(mapping).forEach(key => {
            const val = answers[key];
            if (val === mapping[key].vata) vataPoints += 1;
            else if (val === mapping[key].pitta) pittaPoints += 1;
            else if (val === mapping[key].kapha) kaphaPoints += 1;
        });

        // Each question is 25%.
        return {
            vata_pct: vataPoints * 25,
            pitta_pct: pittaPoints * 25,
            kapha_pct: kaphaPoints * 25
        };
    };

    const handleSubmit = () => {
        if (isComplete) {
            const vikritiPercentages = calculateVikritiPercentages();
            onComplete({ ...answers, ...vikritiPercentages });
        }
    };

    const sections = [
        {
            id: "digestion",
            label: t.digestionLabel,
            options: [
                { value: "heavy", label: t.heavy },
                { value: "acidic", label: t.acidic },
                { value: "gas", label: t.gas },
                { value: "normal", label: t.normal }
            ]
        },
        {
            id: "sleep",
            label: t.sleepLabel,
            options: [
                { value: "insomnia", label: t.insomnia },
                { value: "frequent-wake", label: t.frequentWake },
                { value: "oversleeping", label: t.oversleeping },
                { value: "restful", label: t.restful }
            ]
        },
        {
            id: "mood",
            label: t.moodLabel,
            options: [
                { value: "anxious", label: t.anxious },
                { value: "irritable", label: t.irritable },
                { value: "low", label: t.low },
                { value: "balanced", label: t.balanced }
            ]
        },
        {
            id: "energy",
            label: t.energyLabel,
            options: [
                { value: "constant-fatigue", label: t.constantFatigue },
                { value: "bursts", label: t.bursts },
                { value: "afternoon-dip", label: t.afternoonDip },
                { value: "stable", label: t.stable }
            ]
        }
    ];

    const doshaNames = {
        en: { Vata: "Vata", Pitta: "Pitta", Kapha: "Kapha" },
        hi: { Vata: "वात", Pitta: "पित्त", Kapha: "कफ" },
        mr: { Vata: "वात", Pitta: "पित्त", Kapha: "कफ" }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center md:text-left">
                <span className="bg-amber-100 text-amber-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
                    {t.title}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">{t.subtitle}</h3>
                <p className="text-sm text-slate-600 mt-1">
                    {t.naturalType} <strong>{doshaNames[language][prakriti.dominant]}</strong>. {t.identifyImbalance}
                </p>
            </div>

            <GlassCard className="border-none shadow-xl overflow-hidden">
                <div className="space-y-8 p-2">
                    {/* Imbalance Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {sections.map((section) => (
                            <div key={section.id} className="space-y-3">
                                <label className="text-xs font-bold text-emerald-800 uppercase tracking-widest flex items-center gap-2 pl-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {section.label}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-1 gap-2">
                                    {section.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => handleSelect(section.id, opt.value)}
                                            className={`px-4 py-3 rounded-xl border text-left text-sm transition-all ${answers[section.id] === opt.value
                                                ? "bg-emerald-600 border-emerald-700 text-white shadow-md"
                                                : "bg-white border-slate-100 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/20"
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <hr className="border-slate-100" />

                    {/* Symptoms Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 px-1">
                            <ShieldAlert className="text-amber-500" size={20} />
                            <h4 className="font-bold text-slate-800">{t.healthConcerns}</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.mainConcern}</label>
                                <input
                                    name="mainConcern"
                                    value={answers.mainConcern}
                                    onChange={handleChange}
                                    placeholder={t.concernPlaceholder}
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-white transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.severity}</label>
                                <select
                                    name="severity"
                                    value={answers.severity}
                                    onChange={handleChange}
                                    className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-white transition-all text-sm appearance-none cursor-pointer"
                                >
                                    <option value="Mild">{t.mild}</option>
                                    <option value="Moderate">{t.moderate}</option>
                                    <option value="Severe">{t.severe}</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.describeSymptoms}</label>
                            <textarea
                                name="symptoms"
                                value={answers.symptoms}
                                onChange={handleChange}
                                rows={3}
                                placeholder={t.symptomsPlaceholder}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-white transition-all text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-1">{t.allopathicMedicineLabel}</label>
                            <textarea
                                name="allopathicMedicine"
                                value={answers.allopathicMedicine}
                                onChange={handleChange}
                                rows={2}
                                placeholder={t.allopathicMedicinePlaceholder}
                                className="w-full border-2 border-slate-100 rounded-xl p-3 focus:border-emerald-500 focus:outline-none bg-white transition-all text-sm resize-none"
                            />
                        </div>
                    </div>

                    {/* Submit Note */}
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex gap-3 text-xs text-emerald-800">
                        <AlertCircle className="shrink-0" size={16} />
                        <p>{t.submitNote}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between pt-4">
                        <button
                            onClick={onBack}
                            className="flex items-center px-6 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
                        >
                            <ChevronLeft size={18} className="mr-1" /> {t.back}
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!isComplete}
                            className={`flex items-center px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${!isComplete
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:shadow-emerald-200 hover:-translate-y-0.5"
                                }`}
                        >
                            {t.analyze} <ChevronRight size={18} className="ml-1" />
                        </button>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default VikritiAssessment;
