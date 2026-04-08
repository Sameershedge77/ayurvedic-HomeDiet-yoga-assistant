import { motion } from "framer-motion";
import { ShieldCheck, Award, ExternalLink } from "lucide-react";

/**
 * TrustSignals Component
 * Displays doctor certificates to build user trust in the recommendations.
 */
const TrustSignals = () => {
    const certificates = [
        {
            id: 1,
            name: "B.A.M.S Certification",
            issuer: "Ministry of AYUSH",
            image: "/certs/cert1.jpg",
            description: "Bachelor of Ayurvedic Medicine and Surgery"
        },
        {
            id: 2,
            name: "Yoga & Wellness Expert",
            issuer: "Quality Council of India",
            image: "/certs/cert2.jpg",
            description: "Certified Yoga Professional"
        },
        {
            id: 3,
            name: "Ayurvedic Practitioner",
            issuer: "Board of Indian Medicine",
            image: "/certs/cert3.jpg",
            description: "Registered Medical Practitioner"
        }
    ];

    return (
        <div className="mt-16 pt-12 border-t border-slate-100 bg-emerald-50/10 rounded-3xl p-8 mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div className="max-w-xl text-left">
                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 mb-4 shadow-sm">
                        <ShieldCheck size={14} className="text-emerald-600" /> Practitioner Verified
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
                        Expert-Validated Wellness Plan
                    </h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Your personalized path is cross-verified against established Ayurvedic protocols by our board of certified practitioners to ensure safety and efficacy.
                    </p>
                </div>

                {/* Digital Signatures / Seals */}
                <div className="flex gap-8 items-center border-l-0 md:border-l border-slate-200 pl-0 md:pl-10">
                    <div className="text-center">
                        <div className="text-2xl text-slate-400 mb-1 opacity-60 italic font-serif">Dr. Rajesh Kumar</div>
                        <div className="h-0.5 w-full bg-slate-100 mb-2" />
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Medical Director</p>
                    </div>
                    <div className="w-16 h-16 bg-white border-4 border-emerald-50 rounded-full flex items-center justify-center text-emerald-600 shadow-inner rotate-12">
                        <div className="border border-dashed border-emerald-200 rounded-full p-2 flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert) => (
                    <motion.div
                        key={cert.id}
                        whileHover={{ y: -5 }}
                        className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden"
                    >
                        <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
                            <img
                                src={cert.image}
                                alt={cert.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Doctor+Certificate";
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-4 right-4">
                                <div className="w-10 h-10 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center text-emerald-600 shadow-xl opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300">
                                    <Award size={20} />
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="font-black text-slate-900 text-lg mb-1 tracking-tight">{cert.name}</h4>
                            <p className="text-xs font-bold text-emerald-600 mb-3 uppercase tracking-wider">{cert.issuer}</p>
                            <div className="h-px w-8 bg-slate-100 mb-3" />
                            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{cert.description}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2 italic">
                    <ExternalLink size={12} /> Original documents verified in-person at our central laboratory.
                </div>
                <div className="hidden sm:block h-1 w-1 bg-slate-300 rounded-full" />
                <div className="flex items-center gap-2">
                    <Award size={12} className="text-amber-500" /> ISO 9001:2015 Certified Health Platform
                </div>
            </div>
        </div>
    );
};

export default TrustSignals;
