import { useState, useEffect } from "react";
import { SyllabusHub } from "./components/SyllabusHub";
import { 
  BookOpen, 
  GraduationCap, 
  Sparkles, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Award,
  BookMarked,
  Info,
  Home,
  Volume2,
  VolumeX,
  CloudRain,
  Wind,
  Bird,
  Trees,
  Sprout
} from "lucide-react";
import { motion } from "motion/react";
import { natureAudio } from "./utils/natureAudio";

export default function App() {
  const [completedCount, setCompletedCount] = useState<number>(0);
  
  // Interactive Sound States
  const [rainActive, setRainActive] = useState(false);
  const [windActive, setWindActive] = useState(false);
  const [birdsActive, setBirdsActive] = useState(false);
  const [soundVolume, setSoundVolume] = useState(0.4);

  // Load progress stats from localStorage to show in the header
  useEffect(() => {
    const updateStats = () => {
      try {
        const stored = localStorage.getItem("nrm_syllabus_completed_topics");
        if (stored) {
          const completedArr = JSON.parse(stored);
          setCompletedCount(Array.isArray(completedArr) ? completedArr.length : 0);
        }
      } catch (e) {
        console.error(e);
      }
    };

    updateStats();
    // Listen for progress updates emitted by our child components
    window.addEventListener("syllabus-progress-updated", updateStats);
    return () => {
      window.removeEventListener("syllabus-progress-updated", updateStats);
    };
  }, []);

  const handleToggleRain = () => {
    const next = !rainActive;
    setRainActive(next);
    if (next) {
      natureAudio.startRain();
    } else {
      natureAudio.stopRain();
    }
  };

  const handleToggleWind = () => {
    const next = !windActive;
    setWindActive(next);
    if (next) {
      natureAudio.startWind();
    } else {
      natureAudio.stopWind();
    }
  };

  const handleToggleBirds = () => {
    const next = !birdsActive;
    setBirdsActive(next);
    if (next) {
      natureAudio.startBirds();
    } else {
      natureAudio.stopBirds();
    }
  };

  const handleVolumeChange = (val: number) => {
    setSoundVolume(val);
    natureAudio.setVolume(val);
  };

  useEffect(() => {
    // Stop all audio generators on unmount
    return () => {
      natureAudio.stopAll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-teal-50/40 to-stone-100 text-stone-900 selection:bg-emerald-500/10 selection:text-emerald-950">
      
      {/* Top Banner Grid */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              onClick={() => window.dispatchEvent(new Event("nrm-navigate-home"))}
              className="p-2.5 bg-emerald-600 text-white rounded-xl cursor-pointer shadow-md shadow-emerald-100"
              title="Return to Home Board"
            >
              <GraduationCap className="w-5 h-5" />
            </motion.div>
            <div 
              onClick={() => window.dispatchEvent(new Event("nrm-navigate-home"))}
              className="cursor-pointer select-none"
              title="Return to Home Board"
            >
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-stone-900 text-sm sm:text-base tracking-tight hover:text-emerald-600 transition-colors">NRM Revision Portal</h1>
                <span className="hidden xs:inline-flex items-center text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                  MBA-RM v2.5
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider font-mono flex items-center gap-1">
                <Sprout className="w-3 h-3 text-emerald-600 animate-pulse" /> Environmental & Sustainable Resource Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Home Button always available */}
            <button
              onClick={() => window.dispatchEvent(new Event("nrm-navigate-home"))}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-extrabold text-xs rounded-xl border border-emerald-100 transition-all cursor-pointer shadow-sm"
              title="Exit Exam / Return to Home"
            >
              <Home className="w-3.5 h-3.5 text-emerald-600" />
              <span>Home Board</span>
            </button>

            <div className="hidden md:flex items-center gap-5">
              <span className="h-6 w-[1px] bg-emerald-100" />
              <div className="text-right">
                <span className="text-[9px] font-mono text-emerald-600/80 uppercase font-semibold block">Syllabus Mastery</span>
                <span className="text-xs font-bold text-stone-850 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {completedCount} / 22 topics mastered
                </span>
              </div>
              <span className="h-6 w-[1px] bg-emerald-100" />
              <div className="text-right">
                <span className="text-[9px] font-mono text-emerald-600/80 uppercase font-semibold block">Academic Tier</span>
                <span className="text-xs font-bold text-stone-850 flex items-center gap-1 justify-end">
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  Semester & UGC Prep
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
        
        {/* Intro Hero Section - Styled beautifully using our local Nature Wallpaper */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 sm:p-10 space-y-5 relative overflow-hidden shadow-xl text-white border border-emerald-950/25 print:hidden"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(11, 41, 30, 0.95) 30%, rgba(20, 83, 61, 0.88) 65%, rgba(13, 148, 136, 0.5) 100%), url('/src/assets/images/nature_wallpaper_1784467826515.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Subtle Ambient Light Overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="max-w-3xl space-y-3.5">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-200 uppercase tracking-wider bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
                <Trees className="w-3.5 h-3.5 text-emerald-400" /> Nature-Inspired Revision Board Active
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
                Interactive Natural Resource Management Portal
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
                Master the full ecosystem of NRM policies, environmental evaluation mechanics, and rural welfare theories. 
                Settle down with a custom ambient nature soundtrack, test your knowledge unit-by-unit with our 5,000 MCQ Bank, 
                or launch formal timed competitive examinations with instantaneous grading and granular visual answers.
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 lg:flex lg:flex-col gap-3 shrink-0">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl min-w-[120px] text-center lg:text-left">
                <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Comprehensive Pool</span>
                <span className="text-xs sm:text-sm font-black text-white">5,000 MCQs</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl min-w-[120px] text-center lg:text-left">
                <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">UGC Curriculum</span>
                <span className="text-xs sm:text-sm font-black text-white">6 Major Units</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 p-3 rounded-2xl min-w-[120px] text-center lg:text-left">
                <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Syllabus Standard</span>
                <span className="text-xs sm:text-sm font-black text-white">UGC-CBCS v2</span>
              </div>
            </div>
          </div>

          {/* Quick study instructions / guidelines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5 border-t border-white/15 text-white/90 relative z-10 bg-white/5 backdrop-blur-sm -mx-6 -mb-6 p-6 sm:-mx-10 sm:-mb-10 rounded-b-3xl">
            <div className="flex gap-3">
              <div className="p-2 bg-emerald-900/50 border border-emerald-700/50 rounded-xl text-emerald-300 shrink-0 h-9 w-9 flex items-center justify-center shadow-inner">
                <BookMarked className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Forest-Focused Learning Deck</h4>
                <p className="text-[10px] text-emerald-200 mt-0.5 leading-normal">Practice questions categorized neatly by forestry, commons, and economic assessment modules with thorough solution logs.</p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <div className="p-2 bg-emerald-900/50 border border-emerald-700/50 rounded-xl text-emerald-300 shrink-0 h-9 w-9 flex items-center justify-center shadow-inner">
                <Award className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Simulated Board Assessments</h4>
                <p className="text-[10px] text-emerald-200 mt-0.5 leading-normal">Sit for realistic randomized competitive assessments. Review customized score indicators and download performance data.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="p-2 bg-emerald-900/50 border border-emerald-700/50 rounded-xl text-emerald-300 shrink-0 h-9 w-9 flex items-center justify-center shadow-inner">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-xs">Dynamic Gemini AI Tutor</h4>
                <p className="text-[10px] text-emerald-200 mt-0.5 leading-normal">Need fresh challenges? Generate unlimited new syllabus questions tailored dynamically to any ecological chapter instantly.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CALM STUDY COMPANION - Interactive Nature Ambient Synthesizer Deck */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="bg-white border border-emerald-100 rounded-3xl p-5 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-extrabold text-xs uppercase tracking-wider font-mono">
                <Volume2 className="w-4 h-4 animate-bounce text-emerald-600" />
                <span>Calm Eco-Study Focus Companion</span>
              </div>
              <h3 className="text-sm font-black text-stone-800">
                Turn on immersive natural background sounds to boost your retention & peace while studying
              </h3>
              <p className="text-[10px] text-stone-500 leading-normal">
                Procedurally synthesized directly inside your browser. No internet streaming or audio files required. Safe, lightweight, and offline-compatible.
              </p>
            </div>

            {/* SOUND CONTROLS ROW */}
            <div className="flex flex-wrap items-center gap-3 bg-emerald-50/50 p-2.5 rounded-2xl border border-emerald-100/50">
              
              {/* Forest Birds Toggle */}
              <button
                onClick={handleToggleBirds}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  birdsActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"
                }`}
                title="Toggle chirping forest birds"
              >
                <Bird className={`w-4 h-4 ${birdsActive ? "animate-pulse" : ""}`} />
                <span>Forest Birds {birdsActive ? "ON" : "OFF"}</span>
              </button>

              {/* Canopy Wind Toggle */}
              <button
                onClick={handleToggleWind}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  windActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"
                }`}
                title="Toggle wind rustling canopy leaves"
              >
                <Wind className={`w-4 h-4 ${windActive ? "animate-spin [animation-duration:8s]" : ""}`} />
                <span>Canopy Wind {windActive ? "ON" : "OFF"}</span>
              </button>

              {/* Rain Toggle */}
              <button
                onClick={handleToggleRain}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
                  rainActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white text-stone-600 border border-stone-200 hover:border-emerald-300"
                }`}
                title="Toggle soft soothing forest rain"
              >
                <CloudRain className={`w-4 h-4 ${rainActive ? "animate-bounce" : ""}`} />
                <span>Soft Rain {rainActive ? "ON" : "OFF"}</span>
              </button>

              {/* Master Volume Slider */}
              <div className="flex items-center gap-2 px-2 border-l border-emerald-150 pl-3">
                {soundVolume === 0 ? (
                  <VolumeX className="w-4 h-4 text-stone-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                )}
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.05"
                  value={soundVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-16 accent-emerald-600 h-1 cursor-pointer bg-stone-200 rounded-lg appearance-none"
                  title="Study soundtrack volume"
                />
              </div>

            </div>
          </div>
        </motion.div>

        {/* Central Syllabus Reader & Hub */}
        <SyllabusHub />

      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 mt-16 bg-white py-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs text-emerald-800 font-extrabold font-mono uppercase tracking-wider">
              <Trees className="w-4 h-4 text-emerald-600" />
              <span>NRM ACADEMIC FOREST BOARD</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1 max-w-lg leading-relaxed">
              Designed with green nature principles, interactive responsive matrices, and high-performance offline synthesized soundscapes for peaceful, focused student exam preparation.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-[10px] text-emerald-700 font-mono font-bold">
            <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">UGC-NET Prep</span>
            <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">MBA Rural Management</span>
            <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Forestry Economics</span>
            <span className="bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Sustainable Resource Management</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

