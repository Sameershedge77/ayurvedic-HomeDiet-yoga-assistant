import { motion } from "framer-motion";

const GlassCard = ({ children, className = "", delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={`backdrop-blur-md bg-white/30 border border-white/40 shadow-xl rounded-2xl p-6 ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
