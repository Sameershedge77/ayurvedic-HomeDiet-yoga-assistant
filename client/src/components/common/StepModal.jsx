import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, AlertTriangle } from "lucide-react";

/**
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {object} data - { title, steps: [], benefits: string, contraindications: string, image: string, duration: string }
 */
const StepModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl relative flex flex-col"
                >
                    {/* Header Image */}
                    <div className="h-48 bg-slate-100 relative shrink-0">
                        {data.image ? (
                            <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                                No Image Available
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors backdrop-blur-md"
                        >
                            <X size={20} />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                            <h2 className="text-2xl font-bold text-white shadow-sm">{data.title}</h2>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto custom-scrollbar">

                        {/* Meta Info */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {data.duration && (
                                <div className="flex items-center text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium">
                                    <Clock size={16} className="mr-2" />
                                    {data.duration}
                                </div>
                            )}
                            {data.contraindications && (
                                <div className="flex items-center text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full text-sm font-medium border border-amber-100">
                                    <AlertTriangle size={16} className="mr-2" />
                                    Avoid if: {data.contraindications}
                                </div>
                            )}
                        </div>

                        {/* Benefits */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Benefits</h3>
                            <p className="text-slate-600 leading-relaxed">{data.benefits}</p>
                        </div>

                        {/* Steps */}
                        {data.steps && data.steps.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Step-by-Step Instructions</h3>
                                <div className="space-y-4">
                                    {data.steps.map((step, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <p className="text-slate-700 mt-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Fallback for remedies usage if steps not present */}
                        {!data.steps && data.usage && (
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-2">Usage instructions</h3>
                                <p className="text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{data.usage}</p>
                            </div>
                        )}

                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium">
                            Got it
                        </button>
                    </div>

                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default StepModal;
