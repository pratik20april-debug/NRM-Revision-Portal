import { useState, useEffect, useMemo } from "react";
import { SYLLABUS, SyllabusUnit, Topic } from "../data/syllabus";
import { generateSyntheticMCQs, MCQQuestion } from "../data/mcqBank";
import { 
  CheckCircle2, 
  XCircle, 
  Award, 
  HelpCircle, 
  RotateCcw, 
  Sparkles, 
  Clock, 
  Layers, 
  Filter, 
  Check, 
  ChevronRight, 
  Play, 
  ArrowRight, 
  Search, 
  Brain, 
  Timer, 
  Bookmark, 
  ThumbsUp,
  Sliders,
  BookOpen,
  Info,
  Home,
  BookMarked
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function SyllabusHub() {
  // Mode selection: "home", "practice" or "exam"
  const [activeTab, setActiveTab] = useState<"home" | "practice" | "exam">("home");

  // Load the full 5,000 question bank in-memory (generated dynamically and procedurally for high performance)
  const masterQuestionBank = useMemo(() => generateSyntheticMCQs(5000), []);

  // --- STATS / PERSISTENCE STATE ---
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [answeredIds, setAnsweredIds] = useState<string[]>([]);
  const [reviewFilter, setReviewFilter] = useState<"all" | "correct" | "incorrect" | "unanswered">("all");

  useEffect(() => {
    try {
      const savedAnswered = localStorage.getItem("mcq_total_answered");
      const savedCorrect = localStorage.getItem("mcq_correct_count");
      const savedStreak = localStorage.getItem("mcq_streak");
      const savedBookmarks = localStorage.getItem("mcq_bookmarks");
      const savedAnsweredIds = localStorage.getItem("mcq_answered_ids");

      if (savedAnswered) setAnsweredCount(parseInt(savedAnswered, 10));
      if (savedCorrect) setCorrectCount(parseInt(savedCorrect, 10));
      if (savedStreak) setStreak(parseInt(savedStreak, 10));
      if (savedBookmarks) setBookmarkedIds(JSON.parse(savedBookmarks));

      if (savedAnsweredIds) {
        setAnsweredIds(JSON.parse(savedAnsweredIds));
      } else if (savedAnswered) {
        const initialCount = parseInt(savedAnswered, 10);
        const fallbackIds = masterQuestionBank.slice(0, Math.min(initialCount, masterQuestionBank.length)).map(q => q.id);
        setAnsweredIds(fallbackIds);
        localStorage.setItem("mcq_answered_ids", JSON.stringify(fallbackIds));
      }
    } catch (e) {
      console.error("Failed loading stats from localStorage", e);
    }
  }, [masterQuestionBank]);

  const saveStats = (newAnswered: number, newCorrect: number, newStreak: number) => {
    try {
      setAnsweredCount(newAnswered);
      setCorrectCount(newCorrect);
      setStreak(newStreak);

      localStorage.setItem("mcq_total_answered", newAnswered.toString());
      localStorage.setItem("mcq_correct_count", newCorrect.toString());
      localStorage.setItem("mcq_streak", newStreak.toString());

      // Propagate completion change events to update parent header
      // Keep completed_topics in sync for legacy compatibility
      const mockCompleted = Array.from({ length: Math.min(22, Math.floor(newAnswered / 5)) }, (_, i) => `topic-${i}`);
      localStorage.setItem("nrm_syllabus_completed_topics", JSON.stringify(mockCompleted));
      window.dispatchEvent(new Event("syllabus-progress-updated"));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = (id: string) => {
    const nextBookmarks = bookmarkedIds.includes(id)
      ? bookmarkedIds.filter(bId => bId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(nextBookmarks);
    localStorage.setItem("mcq_bookmarks", JSON.stringify(nextBookmarks));
  };

  // --- PRACTICE MODE STATE ---
  const [selectedUnitId, setSelectedUnitId] = useState<string>("all");
  const [selectedTopicId, setSelectedTopicId] = useState<string>("all");
  const [practiceSearch, setPracticeSearch] = useState<string>("");
  const [practiceIndex, setPracticeIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isExplanationRevealed, setIsExplanationRevealed] = useState<boolean>(false);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiStatus, setAiStatus] = useState<string>("");
  const [revealedBookmarkIds, setRevealedBookmarkIds] = useState<string[]>([]);

  // Custom AI Generated Question list
  const [aiQuestions, setAiQuestions] = useState<MCQQuestion[]>([]);

  // Filtered pool for practice
  const practicePool = useMemo(() => {
    // Combine base & synthetic pool with custom AI questions placed at the top
    const combined = [...aiQuestions, ...masterQuestionBank];
    return combined.filter(q => {
      const matchUnit = selectedUnitId === "all" || q.unitId === selectedUnitId;
      const matchTopic = selectedTopicId === "all" || q.topicId === selectedTopicId;
      const matchText = practiceSearch === "" || 
        q.question.toLowerCase().includes(practiceSearch.toLowerCase()) ||
        q.explanation.toLowerCase().includes(practiceSearch.toLowerCase());
      return matchUnit && matchTopic && matchText;
    });
  }, [selectedUnitId, selectedTopicId, practiceSearch, masterQuestionBank, aiQuestions]);

  const currentPracticeQuestion = practicePool[practiceIndex % practicePool.length] || null;

  const bookmarkedQuestions = useMemo(() => {
    return masterQuestionBank.filter(q => bookmarkedIds.includes(q.id));
  }, [bookmarkedIds, masterQuestionBank]);

  // Handle Answer Selection in Practice
  const handleSelectOptionPractice = (optionIdx: number) => {
    if (selectedOption !== null) return; // already answered
    setSelectedOption(optionIdx);
    setIsExplanationRevealed(true);

    const isCorrect = optionIdx === currentPracticeQuestion.correctIndex;
    const nextAnswered = answeredCount + 1;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    const nextStreak = isCorrect ? streak + 1 : 0;

    saveStats(nextAnswered, nextCorrect, nextStreak);

    if (currentPracticeQuestion && !answeredIds.includes(currentPracticeQuestion.id)) {
      const nextIds = [...answeredIds, currentPracticeQuestion.id];
      setAnsweredIds(nextIds);
      localStorage.setItem("mcq_answered_ids", JSON.stringify(nextIds));
    }
  };

  const handleNextPracticeQuestion = () => {
    setSelectedOption(null);
    setIsExplanationRevealed(false);
    setPracticeIndex(prev => prev + 1);
  };

  // Trigger Gemini dynamic API call for custom MCQ on current filters
  const handleGenerateAiMcq = async () => {
    // Find active topic title
    let topicTitle = "Natural Resource Management & Policy";
    if (selectedTopicId !== "all") {
      const allTopics = SYLLABUS.flatMap(u => u.topics);
      const match = allTopics.find(t => t.id === selectedTopicId);
      if (match) topicTitle = match.title;
    } else if (selectedUnitId !== "all") {
      const unit = SYLLABUS.find(u => u.id === selectedUnitId);
      if (unit) topicTitle = unit.title;
    }

    setAiLoading(true);
    setAiStatus("Consulting Google Gemini for custom curriculum question...");
    try {
      const res = await fetch("/api/mcq/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topicId: selectedTopicId === "all" ? "nrm-general" : selectedTopicId,
          topicTitle: topicTitle
        })
      });
      const data = await res.json();
      if (data.question) {
        const newQ: MCQQuestion = {
          id: `ai-${Date.now()}`,
          unitId: selectedUnitId === "all" ? "unit-2" : selectedUnitId,
          topicId: selectedTopicId === "all" ? "natural-resources" : selectedTopicId,
          question: data.question,
          options: data.options,
          correctIndex: data.correctIndex,
          explanation: data.explanation
        };
        setAiQuestions(prev => [newQ, ...prev]);
        setPracticeIndex(0); // Jump directly to this newly added question
        setSelectedOption(null);
        setIsExplanationRevealed(false);
        setAiStatus(data.message || "New AI Question loaded successfully!");
      }
    } catch (err) {
      console.warn("AI generation failed:", err);
      setAiStatus("Failed to contact Gemini. Standard exam questions loaded seamlessly.");
    } finally {
      setAiLoading(false);
      setTimeout(() => setAiStatus(""), 4000);
    }
  };


  // --- EXAM MODE STATE ---
  const [examLength, setExamLength] = useState<number>(20);
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [examQuestions, setExamQuestions] = useState<MCQQuestion[]>([]);
  const [examCurrentIndex, setExamCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({}); // maps question index to chosen option index
  const [examMarkedForReview, setExamMarkedForReview] = useState<number[]>([]);
  const [examTimer, setExamTimer] = useState<number>(0);
  const [isExamCompleted, setIsExamCompleted] = useState<boolean>(false);
  
  // Scoring results state
  const [examScore, setExamScore] = useState<number>(0);
  const [examCorrectCount, setExamCorrectCount] = useState<number>(0);
  const [examTimeSpent, setExamTimeSpent] = useState<number>(0);

  // Timer effect
  useEffect(() => {
    let interval: any = null;
    if (isExamActive && !isExamCompleted) {
      interval = setInterval(() => {
        setExamTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExamActive, isExamCompleted]);

  // Global home navigation listener to solve "HOME PAGE OPENING ALSO"
  useEffect(() => {
    const handleNavigateHome = () => {
      if (isExamActive && !isExamCompleted) {
        if (window.confirm("Are you sure you want to exit the exam? All progress in this attempt will be discarded.")) {
          setIsExamActive(false);
          setIsExamCompleted(false);
          setActiveTab("home");
        }
      } else {
        setIsExamActive(false);
        setIsExamCompleted(false);
        setActiveTab("home");
      }
    };

    window.addEventListener("nrm-navigate-home", handleNavigateHome);
    return () => {
      window.removeEventListener("nrm-navigate-home", handleNavigateHome);
    };
  }, [isExamActive, isExamCompleted]);

  const [examUnitFilter, setExamUnitFilter] = useState<string>("all");

  const handleStartExam = (specificUnitId: string = "all") => {
    // Generate a clean random selection of questions
    let questionsPool = [...masterQuestionBank];
    if (specificUnitId !== "all") {
      questionsPool = questionsPool.filter(q => q.unitId === specificUnitId);
    }
    const shuffled = questionsPool.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(examLength, shuffled.length));
    
    setExamQuestions(selected);
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamMarkedForReview([]);
    setExamTimer(0);
    setIsExamActive(true);
    setIsExamCompleted(false);
    setExamUnitFilter(specificUnitId);
  };

  const handleAnswerExamQuestion = (optionIdx: number) => {
    setExamAnswers(prev => ({
      ...prev,
      [examCurrentIndex]: optionIdx
    }));
  };

  const handleToggleMarkReview = (idx: number) => {
    setExamMarkedForReview(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleSubmitExam = () => {
    if (!window.confirm("Are you sure you want to submit your exam answer sheet?")) return;
    
    // Evaluate exam
    let correct = 0;
    const nextIds = [...answeredIds];
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) {
        correct++;
      }
      if (!nextIds.includes(q.id)) {
        nextIds.push(q.id);
      }
    });

    const scorePct = Math.round((correct / examQuestions.length) * 100);
    setExamCorrectCount(correct);
    setExamScore(scorePct);
    setExamTimeSpent(examTimer);
    setIsExamCompleted(true);

    // Save aggregated stats to master profile
    const newlyAnswered = answeredCount + examQuestions.length;
    const newlyCorrect = correctCount + correct;
    saveStats(newlyAnswered, newlyCorrect, streak);

    setAnsweredIds(nextIds);
    localStorage.setItem("mcq_answered_ids", JSON.stringify(nextIds));
  };

  const handleExitExam = () => {
    if (isExamCompleted || window.confirm("Are you sure you want to exit the exam? All progress in this attempt will be discarded.")) {
      setIsExamActive(false);
      setIsExamCompleted(false);
      setActiveTab("home"); // Take the user directly back to the central Home Board
    }
  };

  // Grade calculation
  const getLetterGrade = (score: number) => {
    if (score >= 90) return { grade: "A+", desc: "Outstanding Master", color: "text-emerald-600 border-emerald-200 bg-emerald-50", border: "border-emerald-200" };
    if (score >= 80) return { grade: "A", desc: "First Class with Distinction", color: "text-green-600 border-green-200 bg-green-50", border: "border-green-200" };
    if (score >= 70) return { grade: "B+", desc: "Very Good Pass", color: "text-indigo-600 border-indigo-200 bg-indigo-50", border: "border-indigo-200" };
    if (score >= 60) return { grade: "B", desc: "Good Competency", color: "text-amber-600 border-amber-200 bg-amber-50", border: "border-amber-200" };
    if (score >= 50) return { grade: "C", desc: "Pass Grade", color: "text-orange-600 border-orange-200 bg-orange-50", border: "border-orange-200" };
    return { grade: "F", desc: "Needs Revision", color: "text-rose-600 border-rose-200 bg-rose-50", border: "border-rose-200" };
  };

  // Filter topics for the selection dropdown
  const availableTopics = useMemo(() => {
    if (selectedUnitId === "all") return [];
    const unit = SYLLABUS.find(u => u.id === selectedUnitId);
    return unit ? unit.topics : [];
  }, [selectedUnitId]);

  // Overall statistics formatting
  const accuracyRate = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
  const progressPercent = Math.min(100, Math.round((answeredCount / 5000) * 100));

  return (
    <div className="space-y-6">
      
      {/* 5,000 MCQ PROGRESS TRACKER & STATS BOARD */}
      <div id="mcq-stats-banner" className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-200 uppercase tracking-wider bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15">
              <Brain className="w-3.5 h-3.5 text-emerald-300" /> UGC-NET & MBA Practice Challenge
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight">
              Syllabus MCQ Mastery: Goal 5,000 Questions
            </h2>
            <p className="text-xs text-emerald-200 leading-relaxed font-normal">
              Strengthen your conceptual hold on Natural Resource Management, policy frameworks, and rural environmental economics. Work towards answering 5,000 questions to secure your top grade!
            </p>

            {/* Overall Progress bar towards 5,000 MCQs */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-emerald-200 font-bold">5,000 MCQ Challenge Progress</span>
                <span className="text-white font-extrabold">{answeredCount} / 5,000 MCQs ({progressPercent}%)</span>
              </div>
              <div className="w-full bg-white/10 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div 
                  className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.max(1, progressPercent)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 lg:w-auto w-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl">
              <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Total Solved</span>
              <span className="text-lg sm:text-xl font-black text-white">{answeredCount}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl">
              <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Correct Answers</span>
              <span className="text-lg sm:text-xl font-black text-emerald-400">{correctCount}</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl">
              <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Accuracy Rate</span>
              <span className="text-lg sm:text-xl font-black text-emerald-350">{accuracyRate}%</span>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl" title="Leaf Streak Level: Grows as you get consecutive correct answers!">
              <span className="block text-[9px] font-mono text-emerald-300 uppercase font-bold">Leaf Streak</span>
              <span className="text-xs sm:text-sm font-black text-amber-300 flex items-center justify-center gap-1 pt-1">
                {streak === 0 ? "🌱 0" : streak < 4 ? `🌿 ${streak} (Bud)` : streak < 7 ? `🍃 ${streak} (Sprout)` : `🌳 ${streak} (Forest)`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CHOOSE SYSTEM MODE TABS */}
      {!isExamActive && (
        <div className="flex justify-center gap-3 bg-white p-2 border border-emerald-150 rounded-2xl max-w-lg mx-auto shadow-sm my-1">
          <button
            onClick={() => {
              setActiveTab("home");
              setIsExamActive(false);
              setIsExamCompleted(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "home"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-150"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Syllabus Home</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("practice");
              setIsExamActive(false);
              setIsExamCompleted(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "practice"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-150"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Practice Room</span>
          </button>
          <button
            onClick={() => {
              setActiveTab("exam");
              setIsExamActive(false);
              setIsExamCompleted(false);
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black cursor-pointer transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "exam"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-150"
                : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Board Simulator</span>
          </button>
        </div>
      )}

      {/* RENDER EXAM INTERFACE IF ACTIVE */}
      {isExamActive ? (
        <div id="exam-simulation-room" className="bg-white border-2 border-emerald-200 rounded-3xl overflow-hidden shadow-md">
          
          {/* Exam Header */}
          <div className="bg-emerald-950 text-white p-5 flex flex-wrap items-center justify-between gap-4 border-b border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-900/30">
                <Timer className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <span className="inline-block text-[9px] font-mono font-bold px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded border border-emerald-800/40 uppercase">
                  Academic Board Exam Simulation
                </span>
                <h3 className="font-extrabold text-white text-base mt-0.5">Syllabus-Intermixed Trial Board</h3>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer or Score Badge */}
              {!isExamCompleted ? (
                <div className="bg-emerald-900 border border-emerald-800 px-4 py-2 rounded-xl flex items-center gap-2 font-mono text-sm">
                  <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-bold">
                    {Math.floor(examTimer / 60).toString().padStart(2, "0")}:{(examTimer % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <div className="bg-emerald-950/80 border border-emerald-800 px-4 py-2 rounded-xl flex items-center gap-2 font-mono text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Score: {examScore}%</span>
                </div>
              )}

              {!isExamCompleted ? (
                <button
                  onClick={handleSubmitExam}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-950/20"
                >
                  Submit Answer Sheet
                </button>
              ) : (
                <button
                  onClick={handleExitExam}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-950/20"
                >
                  Return to Home Board
                </button>
              )}

              <button
                onClick={handleExitExam}
                className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer p-2"
              >
                {isExamCompleted ? "Close" : "Exit"}
              </button>
            </div>
          </div>

          {/* If exam is not submitted yet */}
          {!isExamCompleted ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
              
              {/* Question Navigation & Progress Checklist Panel (3 cols) */}
              <div className="lg:col-span-3 border-r border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-mono">Exam Answer Grid</h4>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Questions are randomly intermixed from all Units. Select answers, mark questions for review, or skip to other items.
                </p>

                <div className="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-4 gap-2 pt-2">
                  {examQuestions.map((q, idx) => {
                    const isAnswered = examAnswers[idx] !== undefined;
                    const isMarked = examMarkedForReview.includes(idx);
                    const isCurrent = examCurrentIndex === idx;

                    let bgClass = "bg-white text-slate-700 border-slate-200 hover:border-slate-400";
                    if (isAnswered) bgClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
                    if (isMarked) bgClass = "bg-amber-100 text-amber-800 border-amber-300";
                    if (isCurrent) bgClass = "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100";

                    return (
                      <button
                        key={idx}
                        onClick={() => setExamCurrentIndex(idx)}
                        className={`aspect-square rounded-xl text-xs font-bold border flex items-center justify-center transition-all cursor-pointer ${bgClass}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2 text-[10px] font-mono text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-white border border-slate-200 block" />
                    <span>Unanswered</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 block" />
                    <span>Answered & Saved</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 block" />
                    <span>Marked for Review</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-600 block" />
                    <span>Active Question</span>
                  </div>
                </div>
              </div>

              {/* Main Question Focus Sheet (9 cols) */}
              <div className="lg:col-span-9 p-6 sm:p-8 flex flex-col justify-between bg-white">
                
                {/* Question Info */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-block text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 px-3 py-1 rounded-md">
                      QUESTION {examCurrentIndex + 1} OF {examQuestions.length}
                    </span>

                    <button
                      onClick={() => handleToggleMarkReview(examCurrentIndex)}
                      className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        examMarkedForReview.includes(examCurrentIndex)
                          ? "bg-amber-50 text-amber-700 border-amber-200 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:text-slate-800"
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{examMarkedForReview.includes(examCurrentIndex) ? "Marked for Review" : "Mark for Review"}</span>
                    </button>
                  </div>

                  {/* The actual question body */}
                  <div className="space-y-4">
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-800 leading-relaxed">
                      {examQuestions[examCurrentIndex]?.question}
                    </h4>

                    {/* Option cards */}
                    <div className="grid grid-cols-1 gap-3 pt-2">
                      {examQuestions[examCurrentIndex]?.options.map((opt, oIdx) => {
                        const isChosen = examAnswers[examCurrentIndex] === oIdx;
                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleAnswerExamQuestion(oIdx)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                              isChosen
                                ? "bg-emerald-50/50 border-emerald-600 font-bold"
                                : "bg-white border-slate-200 hover:bg-slate-50/30"
                            }`}
                          >
                            <span className={`w-5.5 h-5.5 rounded-full border-2 font-bold text-[10px] flex items-center justify-center shrink-0 ${
                              isChosen
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "border-slate-300 text-slate-400"
                            }`}>
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                            <span className={`text-xs font-semibold leading-normal ${
                              isChosen ? "text-emerald-950 font-bold" : "text-slate-700"
                            }`}>
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer Navigation */}
                <div className="pt-10 flex items-center justify-between border-t border-slate-100 mt-8">
                  <button
                    onClick={() => setExamCurrentIndex(prev => Math.max(0, prev - 1))}
                    disabled={examCurrentIndex === 0}
                    className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 disabled:opacity-30 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Previous
                  </button>

                  <button
                    onClick={handleExitExam}
                    className="px-4 py-2 border border-rose-200 text-rose-600 hover:text-rose-800 text-xs font-bold rounded-xl transition-all cursor-pointer bg-rose-50/50 hover:bg-rose-50"
                  >
                    Abort & Exit
                  </button>

                  {examCurrentIndex === examQuestions.length - 1 ? (
                    <button
                      onClick={handleSubmitExam}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-100"
                    >
                      Finish & Submit
                    </button>
                  ) : (
                    <button
                      onClick={() => setExamCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
                      className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer transition-all"
                    >
                      Next
                    </button>
                  )}
                </div>

              </div>

            </div>
          ) : (
            // EXAM RESULT CARD / STUDY REVIEW SHEET
            <div className="p-6 sm:p-10 space-y-8 bg-slate-50">
              
              {/* Score summary panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Visual score circle */}
                <div className="md:col-span-4 flex flex-col items-center justify-center text-center space-y-2">
                  <div className={`w-32 h-32 rounded-full border-8 flex flex-col items-center justify-center shadow-inner ${
                    getLetterGrade(examScore).border
                  } bg-white`}>
                    <span className="text-4xl font-black text-slate-900 leading-none">{examScore}%</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold mt-1">TOTAL SCORE</span>
                  </div>
                  <div className="space-y-0.5 pt-1">
                    <span className="text-xs font-extrabold text-slate-800 block">Grade Rating:</span>
                    <span className={`inline-block px-3 py-0.5 rounded-full border font-bold text-xs ${getLetterGrade(examScore).color}`}>
                      {getLetterGrade(examScore).grade} — {getLetterGrade(examScore).desc}
                    </span>
                  </div>
                </div>

                {/* Score stats */}
                <div className="md:col-span-8 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-lg">Trial Board Exam Completed!</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Your answer sheet has been evaluated. Review the stats below and read the detailed correct option explanations for every intermixed syllabus topic to fill any remaining learning gaps.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                      <span className="block text-[9px] font-mono text-slate-400 uppercase">Correct Answers</span>
                      <span className="text-base font-extrabold text-slate-800">{examCorrectCount} / {examQuestions.length}</span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl">
                      <span className="block text-[9px] font-mono text-slate-400 uppercase">Time Invested</span>
                      <span className="text-base font-extrabold text-slate-800">
                        {Math.floor(examTimeSpent / 60)}m {examTimeSpent % 60}s
                      </span>
                    </div>
                    <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-xl col-span-2 sm:col-span-1">
                      <span className="block text-[9px] font-mono text-slate-400 uppercase">Avg. Pace Per Question</span>
                      <span className="text-base font-extrabold text-slate-800">
                        {Math.round(examTimeSpent / examQuestions.length)} seconds
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleStartExam("all")}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer shadow-md shadow-emerald-100 flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retake Different Mix</span>
                    </button>
                    <button
                      onClick={handleExitExam}
                      className="px-5 py-2.5 bg-white border border-emerald-250 text-emerald-800 hover:text-emerald-950 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-50"
                    >
                      Exit to Home Board
                    </button>
                  </div>
                </div>

              </div>

              {/* Step-by-Step Question Review Block */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-emerald-600" /> Granular Academic Answer Sheet Review
                </h4>

                {/* Answer Filter pills */}
                <div className="flex flex-wrap items-center gap-2 py-2.5 border-b border-slate-200/50">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1">Filter Answers:</span>
                  {[
                    { id: "all", label: `All (${examQuestions.length})` },
                    { id: "correct", label: `Correct (${examCorrectCount})` },
                    { id: "incorrect", label: `Incorrect (${examQuestions.length - examCorrectCount})` },
                    { id: "unanswered", label: `Unanswered` }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setReviewFilter(p.id as any)}
                      className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
                        reviewFilter === p.id
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {examQuestions.map((q, idx) => {
                    const chosenIdx = examAnswers[idx];
                    const isCorrect = chosenIdx === q.correctIndex;
                    const isUnanswered = chosenIdx === undefined;

                    // Apply active review filter
                    if (reviewFilter === "correct" && !isCorrect) return null;
                    if (reviewFilter === "incorrect" && (isCorrect || isUnanswered)) return null;
                    if (reviewFilter === "unanswered" && !isUnanswered) return null;

                    return (
                      <div 
                        key={idx} 
                        className={`border rounded-2xl p-5 bg-white space-y-4 shadow-sm relative ${
                          isCorrect ? "border-emerald-200/80" : "border-rose-200/80"
                        }`}
                      >
                        {/* Status Label */}
                        <div className="absolute top-5 right-5">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                            </span>
                          ) : isUnanswered ? (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full font-mono uppercase">
                              Unanswered
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full font-mono uppercase">
                              <XCircle className="w-3 h-3" /> Incorrect (0)
                            </span>
                          )}
                        </div>

                        {/* Question Text */}
                        <div className="max-w-[80%]">
                          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">Question {idx + 1}</span>
                          <p className="text-xs font-extrabold text-slate-800 leading-normal mt-1">{q.question}</p>
                        </div>

                        {/* Options comparison */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                          {q.options.map((opt, oIdx) => {
                            const isChosen = chosenIdx === oIdx;
                            const isAnswerCorrect = q.correctIndex === oIdx;

                            let borderClass = "border-slate-100";
                            let icon = null;
                            if (isAnswerCorrect) {
                              borderClass = "border-emerald-500 bg-emerald-50/20";
                              icon = <Check className="w-3.5 h-3.5 text-emerald-600 inline-block shrink-0 mt-0.5" />;
                            } else if (isChosen) {
                              borderClass = "border-rose-500 bg-rose-50/20";
                              icon = <XCircle className="w-3.5 h-3.5 text-rose-600 inline-block shrink-0 mt-0.5" />;
                            }

                            return (
                              <div key={oIdx} className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${borderClass}`}>
                                <span className={`w-4 h-4 rounded-full font-bold text-[9px] flex items-center justify-center shrink-0 ${
                                  isChosen 
                                    ? isCorrect 
                                      ? "bg-emerald-600 text-white" 
                                      : "bg-rose-600 text-white"
                                    : isAnswerCorrect 
                                      ? "bg-emerald-600 text-white"
                                      : "bg-slate-100 text-slate-500"
                                }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <span className="flex-1 text-slate-700 leading-normal">{opt}</span>
                                {icon}
                              </div>
                            );
                          })}
                        </div>

                        {/* Detailed Explanation */}
                        <div className="bg-emerald-50/40 border border-emerald-150/60 rounded-xl p-4 mt-2 text-xs space-y-1.5">
                          <span className="font-bold text-emerald-850 block text-[10px] uppercase font-mono tracking-wider">Correct Option Answer Explanation:</span>
                          <p className="text-stone-650 leading-relaxed font-normal">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          )}

        </div>
      ) : (
        <AnimatePresence mode="wait">
          {activeTab === "home" && (
            <motion.div
              key="home-dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-6"
            >
              {/* WELCOME GRADE PREDICTION CARD */}
              <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div className="space-y-1">
                  <h3 className="font-extrabold text-stone-950 text-sm flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <span>Welcome to your Academic NRM Home Board</span>
                  </h3>
                  <p className="text-[11px] text-stone-500 max-w-xl leading-relaxed">
                    Get an exhaustive view of your current syllabus coverage across all modules. Launch dedicated subject drills or practice customizable competitive board simulations.
                  </p>
                </div>
                <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl shrink-0 flex items-center gap-3">
                  <Award className="w-10 h-10 text-emerald-600 shrink-0" />
                  <div>
                    <span className="block text-[9px] font-mono font-bold text-emerald-700 uppercase">Predicted UGC-NET Level</span>
                    <span className="text-xs font-black text-stone-800">
                      {accuracyRate >= 80 ? "First Class with Distinction 🌟" : accuracyRate >= 55 ? "First Class Grade 👍" : "Pass Class — Needs Revision 📚"}
                    </span>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SYLLABUS UNITS GRID */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                  <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wide font-mono">Interactive Syllabus Units Mastery Matrix</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {SYLLABUS.map((unit) => {
                    const unitQs = masterQuestionBank.filter(q => q.unitId === unit.id);
                    const solvedInUnit = unitQs.filter(q => answeredIds.includes(q.id)).length;
                    const unitPercent = unitQs.length > 0 ? Math.round((solvedInUnit / unitQs.length) * 100) : 0;

                    return (
                      <div 
                        key={unit.id} 
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-emerald-300 transition-all shadow-sm flex flex-col justify-between space-y-4 relative group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                              {unit.id.toUpperCase()}
                            </span>
                            <span className="text-[10px] font-mono text-stone-400 font-bold">
                              {unit.topics.length} CORE TOPICS
                            </span>
                          </div>
                          <h5 className="font-extrabold text-stone-900 text-xs leading-snug group-hover:text-emerald-800 transition-colors">
                            {unit.title}
                          </h5>
                          <p className="text-[10px] text-stone-500 leading-normal line-clamp-2">
                            Covers {unit.topics.map(t => t.title).join(", ")}.
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[10px] font-mono">
                            <span className="text-stone-400">Solved Stats</span>
                            <span className="text-stone-700 font-bold">{solvedInUnit} / {unitQs.length} Qs ({unitPercent}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all"
                              style={{ width: `${Math.max(1, unitPercent)}%` }}
                            />
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          <button
                            onClick={() => {
                              setSelectedUnitId(unit.id);
                              setSelectedTopicId("all");
                              setActiveTab("practice");
                            }}
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100/80 text-emerald-800 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1"
                          >
                            <BookOpen className="w-3 h-3 text-emerald-600" />
                            <span>Practice Unit</span>
                          </button>
                          <button
                            onClick={() => {
                              setExamLength(20);
                              handleStartExam(unit.id);
                            }}
                            className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-extrabold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
                          >
                            <Award className="w-3 h-3 text-white" />
                            <span>Unit Exam</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* REVISION DECK & INTERACTIVE BOOKMARKS LIST */}
              <div className="border border-emerald-150 rounded-3xl p-6 bg-gradient-to-br from-white to-emerald-50/5 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-5 h-5 text-emerald-600" />
                    <h4 className="font-extrabold text-stone-900 text-xs uppercase tracking-wide font-mono">Interactive Bookmark Revision Room</h4>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100/50 px-2.5 py-1 rounded-full border border-emerald-150">
                    {bookmarkedQuestions.length} Pinned Question{bookmarkedQuestions.length === 1 ? "" : "s"}
                  </span>
                </div>

                {bookmarkedQuestions.length === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-xs font-bold text-stone-600">No pinned questions in your revision deck yet.</p>
                    <p className="text-[10px] text-stone-400 max-w-xs mx-auto leading-normal">
                      Click the bookmark pin 📌 on any question card inside the Practice Room, and they will immediately appear here for focused academic review.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {bookmarkedQuestions.map((q) => {
                      const isRevealed = revealedBookmarkIds.includes(q.id);
                      return (
                        <div key={q.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 relative flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono text-emerald-600 font-bold uppercase">
                                {SYLLABUS.find(u => u.id === q.unitId)?.title.split(":")[0] || "NRM"}
                              </span>
                              <button
                                onClick={() => handleToggleBookmark(q.id)}
                                className="text-amber-500 hover:text-stone-400 transition-colors p-1"
                                title="Remove Bookmark"
                              >
                                <Bookmark className="w-4 h-4 fill-amber-400 stroke-amber-500" />
                              </button>
                            </div>
                            <p className="text-xs font-bold text-stone-800 leading-normal">
                              {q.question}
                            </p>
                          </div>

                          {isRevealed && (
                            <div className="space-y-2 pt-2 border-t border-slate-100 animate-fade-in">
                              <div className="space-y-1.5">
                                {q.options.map((opt, oIdx) => (
                                  <div 
                                    key={oIdx} 
                                    className={`p-2 rounded-lg border text-[10px] leading-relaxed font-semibold flex items-start gap-1.5 ${
                                      q.correctIndex === oIdx 
                                        ? "border-emerald-500 bg-emerald-50/20 text-emerald-900" 
                                        : "border-slate-100 text-stone-500"
                                    }`}
                                  >
                                    <span className={`w-3.5 h-3.5 rounded-full font-bold text-[8px] flex items-center justify-center shrink-0 ${
                                      q.correctIndex === oIdx ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span>{opt}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 text-[10px] text-stone-600 leading-relaxed font-normal">
                                <span className="font-extrabold text-emerald-800 block mb-0.5">Explanation:</span>
                                {q.explanation}
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => {
                              setRevealedBookmarkIds(prev => 
                                prev.includes(q.id) ? prev.filter(id => id !== q.id) : [...prev, q.id]
                              );
                            }}
                            className="w-full py-1.5 text-center bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-bold rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>{isRevealed ? "Hide Solution Details" : "Reveal Option & Explanation"}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "practice" && (
            <motion.div
              key="practice-board-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              id="practice-board"
              className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12 min-h-[650px]"
            >
              {/* LEFT COLUMN: Topic Filter Panels (4 cols) */}
              <div className="lg:col-span-4 border-r border-emerald-100 flex flex-col bg-emerald-50/5">
                <div className="p-5 border-b border-emerald-100/80 space-y-3 bg-white">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-emerald-600 animate-pulse" />
                    <h3 className="font-bold text-stone-850 text-sm">Practice Filters</h3>
                  </div>
                  <p className="text-[11px] text-stone-500 leading-normal">
                    Select your focus area or unit below. Filter by keyword to search the extensive 5,000 MCQ bank instantly.
                  </p>

                  {/* Search question input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search 5000 question bank..."
                      value={practiceSearch}
                      onChange={(e) => {
                        setPracticeSearch(e.target.value);
                        setPracticeIndex(0);
                      }}
                      className="w-full text-xs bg-stone-50 border border-stone-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 rounded-xl px-3.5 py-2.5 text-stone-850 font-semibold placeholder-stone-400 transition-all"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>

                {/* Selection Dropdown List */}
                <div className="p-4 flex-1 overflow-y-auto max-h-[500px] space-y-3.5">
                  
                  {/* Select Unit */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Syllabus Unit Focus</label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => {
                        setSelectedUnitId(e.target.value);
                        setSelectedTopicId("all");
                        setPracticeIndex(0);
                      }}
                      className="w-full text-xs bg-white border border-emerald-100 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-850 font-semibold cursor-pointer shadow-sm hover:border-emerald-200 transition-all"
                    >
                      <option value="all">🌳 All Units Intermixed</option>
                      {SYLLABUS.map(u => (
                        <option key={u.id} value={u.id}>{u.title}</option>
                      ))}
                    </select>
                  </div>

                  {/* Select Topic */}
                  {selectedUnitId !== "all" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">Specific Chapter</label>
                      <select
                        value={selectedTopicId}
                        onChange={(e) => {
                          setSelectedTopicId(e.target.value);
                          setPracticeIndex(0);
                        }}
                        className="w-full text-xs bg-white border border-emerald-100 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 text-stone-850 font-semibold cursor-pointer shadow-sm hover:border-emerald-200 transition-all"
                      >
                        <option value="all">🌿 Entire Unit Intermixed</option>
                        {availableTopics.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Challenge mode overview */}
                  <div className="bg-emerald-50/60 border border-emerald-150 rounded-xl p-4 space-y-2.5">
                    <span className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-emerald-800 uppercase">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Endless Study Mode
                    </span>
                    <p className="text-[10px] text-emerald-900 leading-relaxed">
                      The active subset of questions filtered contains <strong className="text-emerald-950 font-extrabold">{practicePool.length} distinct matching MCQs</strong>.
                    </p>
                    <p className="text-[10px] text-emerald-600 leading-normal">
                      Shuffling and parametric variations are automatically activated to keep practice dynamically rigorous.
                    </p>
                  </div>

                  {/* RESET STATS BUTTON */}
                  <button
                    onClick={() => {
                      if (window.confirm("Are you sure you want to reset all your scored progress parameters? This will wipe your MCQ solved counts.")) {
                        saveStats(0, 0, 0);
                        setAnsweredIds([]);
                        localStorage.removeItem("mcq_answered_ids");
                      }
                    }}
                    className="w-full text-center text-[10px] font-mono font-medium text-slate-400 hover:text-red-500 border border-dashed border-slate-200 hover:border-red-200 p-2.5 rounded-xl transition-all cursor-pointer bg-white"
                  >
                    Reset Solved Progress
                  </button>

                </div>
              </div>

              {/* RIGHT COLUMN: Active MCQ Worksheet (8 cols) */}
              <div className="lg:col-span-8 flex flex-col justify-between bg-white p-6 sm:p-8">
                
                {currentPracticeQuestion ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    
                    {/* Active Question Title & Navigation Bar */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <div>
                          <span className="text-[10px] font-mono font-extrabold text-emerald-700 uppercase tracking-wider block">
                            {SYLLABUS.find(u => u.id === currentPracticeQuestion.unitId)?.title.split(":")[0] || "Unit II"}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono font-bold">
                            Topic Reference: {currentPracticeQuestion.topicId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Bookmark */}
                          <button
                            onClick={() => handleToggleBookmark(currentPracticeQuestion.id)}
                            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                              bookmarkedIds.includes(currentPracticeQuestion.id)
                                ? "bg-amber-50 border-amber-200 text-amber-500"
                                : "bg-white border-slate-200 hover:bg-slate-50 text-slate-400"
                            }`}
                            title="Bookmark question"
                          >
                            <Bookmark className="w-4 h-4 fill-current" />
                          </button>

                          {/* AI Question Button */}
                          <button
                            onClick={handleGenerateAiMcq}
                            disabled={aiLoading}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-[10px] font-bold rounded-lg shadow-md shadow-emerald-100 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{aiLoading ? "Consulting..." : "Generate AI MCQ"}</span>
                          </button>
                        </div>
                      </div>

                      {/* Status update banner */}
                      {aiStatus && (
                        <div className="bg-emerald-50 border border-emerald-150 text-emerald-900 p-3 rounded-xl text-xs flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                          <span>{aiStatus}</span>
                        </div>
                      )}

                      {/* Active Question Body */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                          MCQ Practice Challenge ({practiceIndex + 1} of {practicePool.length})
                        </h4>
                        <p className="text-sm sm:text-base font-extrabold text-slate-850 leading-relaxed">
                          {currentPracticeQuestion.question}
                        </p>
                      </div>

                      {/* MCQ Options Stack */}
                      <div className="grid grid-cols-1 gap-3 pt-3">
                        {currentPracticeQuestion.options.map((opt, oIdx) => {
                          const isSelected = selectedOption === oIdx;
                          const isCorrectAnswer = currentPracticeQuestion.correctIndex === oIdx;

                          let cardStyle = "bg-white border-slate-150 hover:bg-slate-50/40";
                          let badgeStyle = "border-slate-300 text-slate-400";
                          let indicator = null;

                          // Answer reveal style updates
                          if (selectedOption !== null) {
                            if (isCorrectAnswer) {
                              cardStyle = "bg-emerald-50/60 border-emerald-500 text-emerald-950 font-bold";
                              badgeStyle = "bg-emerald-600 text-white border-emerald-600";
                              indicator = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />;
                            } else if (isSelected) {
                              cardStyle = "bg-rose-50/60 border-rose-500 text-rose-950 font-bold";
                              badgeStyle = "bg-rose-600 text-white border-rose-600";
                              indicator = <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />;
                            } else {
                              cardStyle = "bg-white border-slate-100 opacity-60";
                            }
                          }

                          return (
                            <div
                              key={oIdx}
                              onClick={() => selectedOption === null && handleSelectOptionPractice(oIdx)}
                              className={`p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 select-none ${
                                selectedOption === null ? "cursor-pointer" : "cursor-default"
                              } ${cardStyle}`}
                            >
                              <span className={`w-5.5 h-5.5 rounded-full border-2 font-bold text-[10px] flex items-center justify-center shrink-0 ${badgeStyle}`}>
                                {String.fromCharCode(65 + oIdx)}
                              </span>
                              <span className="flex-1 text-xs sm:text-sm font-semibold leading-relaxed">
                                {opt}
                              </span>
                              {indicator}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Answer reveal detailed explanation block */}
                    <div className="min-h-[120px] mt-6">
                      <AnimatePresence>
                        {isExplanationRevealed && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="bg-emerald-50/50 border border-emerald-100/80 rounded-2xl p-4.5 space-y-2.5 shadow-inner"
                          >
                            <div className="flex items-center gap-2">
                              <HelpCircle className="w-4 h-4 text-emerald-600" />
                              <h5 className="text-[11px] font-extrabold text-emerald-950 font-mono uppercase tracking-wider">
                                Correct Option Answer Explanation:
                              </h5>
                            </div>
                            <p className="text-xs text-emerald-900 leading-relaxed font-semibold">
                              {currentPracticeQuestion.explanation}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Practice controller footer */}
                    <div className="pt-6 border-t border-slate-150 flex items-center justify-between mt-8">
                      <button
                        onClick={() => {
                          setSelectedOption(null);
                          setIsExplanationRevealed(false);
                          setPracticeIndex(prev => (prev === 0 ? practicePool.length - 1 : prev - 1));
                        }}
                        className="px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Previous Question
                      </button>

                      <span className="text-[10px] font-mono text-slate-400">
                        Challenge active: {practicePool.length} MCQs matched
                      </span>

                      <button
                        onClick={handleNextPracticeQuestion}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-100 flex items-center gap-1"
                      >
                        <span>Next Question</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>

                  </div>
                ) : (
                  <div className="h-full min-h-[400px] flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="p-3 bg-slate-50 rounded-full border border-slate-100 text-slate-400">
                      <Info className="w-6 h-6" />
                    </div>
                    <div className="space-y-1.5 max-w-xs">
                      <p className="text-xs font-bold text-slate-700">No matching questions found.</p>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        Try relaxing your keyword filters or selecting a different syllabus unit.
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          )}

          {activeTab === "exam" && (
            <motion.div
              key="exam-setup-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white border border-emerald-100 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto space-y-6 shadow-md"
            >
              <div className="text-center space-y-2">
                <h3 className="font-extrabold text-stone-900 text-base flex items-center justify-center gap-2 text-emerald-800">
                  <Award className="w-5 h-5 text-emerald-600 animate-bounce" /> Start Academic Trial Board Exam
                </h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  This mimics real competitive tests. Questions are fully randomized and intermixed across all 6 units of the syllabus. You can review and navigate through items freely.
                </p>
              </div>

              {/* Configuration details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-emerald-100 p-4 rounded-2xl bg-emerald-50/10 space-y-1.5">
                  <label className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Select Exam Size</label>
                  <div className="flex gap-2 pt-1">
                    {[10, 20, 50, 100].map(sz => (
                      <button
                        key={sz}
                        onClick={() => setExamLength(sz)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          examLength === sz
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-stone-650 border-stone-200 hover:border-emerald-400"
                        }`}
                      >
                        {sz} Qs
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border border-emerald-100 p-4 rounded-2xl bg-emerald-50/10 space-y-1">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">Simulation Properties</span>
                  <p className="text-[11px] text-stone-700 leading-normal font-semibold pt-1">
                    • Target Time: {examLength * 1.5} Minutes
                  </p>
                  <p className="text-[11px] text-stone-700 leading-normal font-semibold">
                    • Grading Scheme: UGC-NET Competitive Scoring
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleStartExam("all")}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-white" />
                <span>Launch Simulation Board Exam</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      )}

    </div>
  );
}
