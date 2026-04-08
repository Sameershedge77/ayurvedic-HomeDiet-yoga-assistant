import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Heart, MessageSquare, PlayCircle, History, Volume2, VolumeX, Music, Play, Pause, Rewind, FastForward, Maximize } from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync state with video properties
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
      videoRef.current.volume = 1.0;
    }
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(err => console.log("Play blocked:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handleStart = () => {
    navigate("/login");
  };

  const handleSeeHowItWorks = (e) => {
    e.preventDefault();
    videoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      setIsPlaying(true);
      videoRef.current.play().catch(err => console.log("Autoplay with sound blocked:", err));
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const togglePlay = (e) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const handleSkipBackward = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const handleSkipForward = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleFullScreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if (videoRef.current.webkitRequestFullscreen) {
        videoRef.current.webkitRequestFullscreen();
      } else if (videoRef.current.msRequestFullscreen) {
        videoRef.current.msRequestFullscreen();
      }
    }
  };


  return (
    <div className="min-h-screen bg-[#FDFDFB] relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-50/40 to-transparent pointer-events-none" />
      <div className="absolute top-[5%] right-[-5%] w-[400px] h-[400px] bg-emerald-100/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />

      <Navbar />


      {/* Hero Section */}
      <main className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

        {/* Left Content */}
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white shadow-lg shadow-emerald-100/30 border border-emerald-50 text-[10px] font-black uppercase tracking-[0.15em] text-emerald-600"
          >
            <Sparkles size={12} className="animate-spin-slow" />
            Empowering Modern Life with Ancient Wisdom
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1]"
          >
            Transform Your
            <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-lime-500 bg-clip-text text-transparent">
              Health Daily.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-base md:text-lg text-slate-500 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed"
          >
            AyurHealth bridges the gap between traditional Ayurveda and your modern routine. Personalized diet, yoga, and remedies tailored to your unique Prakriti.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-5"
          >
            <button
              onClick={handleStart}
              className="px-8 py-4 rounded-xl bg-slate-900 text-white text-[12px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-emerald-600 hover:-translate-y-0.5 transition-all flex items-center gap-2.5 group"
            >
              Start Free Assessment
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
            </button>

            <a
              href="#how-it-works"
              onClick={handleSeeHowItWorks}
              className="flex items-center gap-2.5 text-[12px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full border-2 border-slate-100 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
                <PlayCircle size={20} />
              </div>
              See How It Works
            </a>
          </motion.div>
        </div>

        {/* Right Video Section */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="flex-1 relative w-full"
        >
          <div className="relative z-10 bg-slate-900 rounded-[2.5rem] p-2 shadow-[0_40px_80px_-15px_rgba(16,185,129,0.2)] border border-emerald-100/20 max-w-2xl mx-auto overflow-hidden group">
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full rounded-[2rem] object-cover opacity-90 group-hover:opacity-100 transition-opacity cursor-pointer"
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/images/logos/Intro Video (Before Prakriti Assesment).mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Custom Video Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 px-5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button onClick={handleSkipBackward} className="text-white hover:text-emerald-400 transition-colors" title="Backward 10s">
                <Rewind size={20} />
              </button>
              <button onClick={togglePlay} className="text-white hover:text-emerald-400 transition-colors" title={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button onClick={handleSkipForward} className="text-white hover:text-emerald-400 transition-colors" title="Forward 10s">
                <FastForward size={20} />
              </button>
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              <button onClick={toggleMute} className="text-white hover:text-emerald-400 transition-colors" title={isMuted ? "Unmute" : "Mute"}>
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <div className="w-px h-6 bg-white/20 mx-1"></div>
              <button onClick={handleFullScreen} className="text-white hover:text-emerald-400 transition-colors" title="Full Screen">
                <Maximize size={20} />
              </button>
            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Decorative Elements */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full" />
          <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-500/10 blur-3xl rounded-full" />
        </motion.div>
      </main>

      {/* Why AyurHealth Section */}
      <section id="why" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Why Generic Advice <br />
              <span className="text-emerald-600">Doesn&apos;t Work.</span>
            </h2>
            <p className="text-slate-500 text-base leading-relaxed font-medium">
              Most fitness apps ignore your body type (Prakriti) and your current imbalances (Vikriti). AyurHealth uses a specialized AI engine to ensure every yoga pose and diet tip is safe for your joints and effective for your constitution.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                  <Zap size={16} className="text-amber-500" /> Rule-Based Safety
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Automatic exclusion of poses that strain your active pain points.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
                <h4 className="font-black text-slate-900 text-sm mb-1.5 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-emerald-500" /> Authentic Ayurveda
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Based on classical texts and verified by qualified practitioners.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <StepCard number="01" title="Deep Assessment" body="Discover your unique body type and current health issues through a visual quiz." />
            <StepCard number="02" title="Personalized Insights" body="Our engine maps 500+ remedies and yoga flows to your health profile instantly." />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-slate-900 py-24 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-12">How AyurHealth Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-black mx-auto">1</div>
              <h4 className="text-lg font-black">Assessment</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Fill a quick quiz about your lifestyle and current health concerns.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-black mx-auto">2</div>
              <h4 className="text-lg font-black">AI Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Our model maps your profile to curated Ayurvedic recommendations.</p>
            </div>
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-sm font-black mx-auto">3</div>
              <h4 className="text-lg font-black">Guidance</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Get a daily plan with step-by-step instructions for yoga and remedies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Precision Wellness.</h2>
          <p className="text-slate-500 font-medium text-base">Everything you need to find your natural balance.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <FeatureItem
            icon={<Sparkles className="text-emerald-600" size={28} />}
            title="AI Recommendation"
            body="Advanced mapping of symptoms to curated solutions with step-by-step guidance."
          />
          <FeatureItem
            icon={<MessageSquare className="text-teal-600" size={28} />}
            title="Wellness Assistant"
            body="Real-time assistance for queries regarding preparation, posture, or substitutes."
          />
          <FeatureItem
            icon={<ShieldCheck className="text-lime-600" size={28} />}
            title="Expert Consultation"
            body="Seamlessly transition from self-care to expert consultations with certified doctors."
          />
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="max-w-4xl mx-auto px-6 pb-24 text-center">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
          <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">Medical Disclaimer</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-medium">
            AyurHealth is a learning and wellness-support tool. It does not diagnose or treat medical conditions and should not replace a doctor or qualified practitioner. If you have severe pain or chronic illness, always consult a professional.
          </p>
        </div>
      </section>
    </div>
  );
};

const StepCard = ({ number, title, body }) => (
  <motion.div
    whileHover={{ x: 8 }}
    className="p-6 rounded-2xl bg-white border border-slate-100 flex gap-4 group hover:bg-slate-50 transition-all shadow-sm"
  >
    <span className="text-lg font-black text-emerald-600/30 group-hover:text-emerald-600 transition-colors">{number}</span>
    <div>
      <h4 className="text-sm font-black text-slate-900 mb-1">{title}</h4>
      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{body}</p>
    </div>
  </motion.div>
);

const FeatureItem = ({ icon, title, body }) => (
  <div className="space-y-4 group">
    <div className="w-14 h-14 rounded-xl bg-white shadow-md shadow-slate-100 border border-slate-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:-translate-y-1">
      {icon}
    </div>
    <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>
    <p className="text-sm text-slate-500 font-medium leading-relaxed">{body}</p>
  </div>
);

export default LandingPage;
