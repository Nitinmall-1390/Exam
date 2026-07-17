import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Brain, Clock, ShieldAlert, Sparkles, Star, Users, Zap } from 'lucide-react';
import { useProgressStore } from '../store/progressStore';
import heroImg from '../assets/hero.png';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { attempts } = useProgressStore();

  const handleStartExam = (mockId: number) => {
    navigate(`/exam/${mockId}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: 'easeOut' as const }
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-gradient-to-tr from-rose-50/70 via-pink-50/50 to-amber-50/60 dark:from-rose-950/20 dark:via-slate-950 dark:to-purple-950/20 pb-16 md:pb-24">
      {/* Floating hearts and sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-500/20 dark:text-rose-500/10"
            initial={{ 
              x: `${Math.random() * 100}%`, 
              y: '110vh', 
              scale: Math.random() * 0.7 + 0.4,
              opacity: Math.random() * 0.5 + 0.1
            }}
            animate={{ 
              y: '-10vh',
              rotate: [0, 10, -10, 0],
            }}
            transition={{ 
              duration: Math.random() * 12 + 12, 
              repeat: Infinity, 
              ease: 'linear',
              delay: Math.random() * 10 
            }}
          >
            {i % 3 === 0 ? '❤️' : i % 3 === 1 ? '✨' : '💖'}
          </motion.div>
        ))}
      </div>

      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/10 blur-[120px] dark:bg-rose-600/5 pointer-events-none animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-400/10 blur-[120px] dark:bg-pink-600/5 pointer-events-none animate-pulse" style={{ animationDuration: '12s' }} />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text */}
          <motion.div
            className="lg:col-span-7 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/40 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm shadow-rose-100/50 dark:shadow-none">
              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
              Ultimate JCECEB B.Sc. Nursing prep
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6">
              Conquer the JCECEB{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 dark:from-rose-400 dark:via-pink-400 dark:to-amber-400">
                Nursing Entrance
              </span>
            </h1>
            
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Elevate your preparation with 10 high-fidelity, full-length mock examinations modeled exactly after JCECEB syllabus standards. Real questions, detailed NCERT-linked rationales, and memory tricks.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-sm shadow-lg shadow-rose-500/20 hover:shadow-rose-500/30 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Start Free Mock Tests
              </button>
              <a
                href="#exam-pattern"
                className="px-8 py-3.5 rounded-xl border border-rose-200 dark:border-rose-900/30 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 text-rose-750 dark:text-rose-350 font-bold text-sm transition-colors"
              >
                View Exam Pattern
              </a>
            </div>
          </motion.div>

          {/* Right Column: Hero Cover Image */}
          <motion.div
            className="lg:col-span-5 flex justify-center lg:justify-end animate-fade-in"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[340px] aspect-[9/16] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 ring-1 ring-slate-200/50 dark:ring-slate-800/50">
              <img
                src={heroImg}
                alt="JCECEB Nursing Cover"
                className="w-full h-full object-cover transform hover:scale-102 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>

        {/* Feature Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="glass-effect rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" variants={itemVariants}>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 dark:bg-rose-400/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">NCERT Class 11 & 12 Mapped</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every single Biology, Chemistry, and Physics question maps directly to syllabus weightages from NCERT textbooks.
            </p>
          </motion.div>

          <motion.div className="glass-effect rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" variants={itemVariants}>
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 dark:bg-pink-400/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Memory Tricks & Mnemonics</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Stuck on formulas or complex cycles? Detailed solutions contain fast mnemonics to anchor the concept in your memory.
            </p>
          </motion.div>

          <motion.div className="glass-effect rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden" variants={itemVariants}>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Negative Marking Engine</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Practice under exact exam guidelines including negative marking (-0.25 per wrong answer) to optimize raw accuracy.
            </p>
          </motion.div>
        </motion.div>

        {/* Test Mock Cards */}
        <div className="mt-20 md:mt-32">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
              Full-Length Mock Series
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Select one of our 10 full-length mock tests. Each mock contains 150 questions (50 Bio, 50 Chem, 50 Phys) for a 2-hour practice block.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((id) => {
              const completed = attempts.some(a => a.mockTestId === id);
              return (
                <div
                  key={id}
                  className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {completed && (
                    <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                      Completed
                    </span>
                  )}
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                    Mock Test {id}
                  </h3>
                  <p className="text-xs text-slate-500 mb-4 uppercase tracking-widest font-semibold">
                    150 Questions • 150 Marks
                  </p>
                  
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-rose-500" />
                      <span>Duration: 120 Minutes (2 hrs)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                      <Star className="w-3.5 h-3.5 text-rose-500" />
                      <span>Grading: +1 for Correct, -0.25 for Incorrect</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartExam(id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5
                      ${completed 
                        ? 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-350' 
                        : 'bg-gradient-to-r from-rose-500 to-pink-650 hover:from-rose-600 hover:to-pink-700 text-white shadow-md shadow-rose-500/10'
                      }`}
                  >
                    {completed ? 'Retake Test' : 'Attempt Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exam Pattern Grid */}
        <div id="exam-pattern" className="mt-24 md:mt-32 p-8 rounded-3xl bg-rose-50/30 dark:bg-rose-950/5 border border-rose-100/50 dark:border-rose-950/20">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
              JCECEB B.Sc. Nursing Exam Guidelines
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Understanding the marking layout of the Jharkhand combined entrance exam helps in scoring higher.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">3 Subjects</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Biology (50), Physics (50), and Chemistry (50) questions.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">120 Mins</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">2 hours total, equivalent to 48 seconds per question.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">+1.0 Marks</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">For every correct answer submitted on the portal.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-650 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">-0.25 Marks</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Deducted for incorrect answers. 0 for skipped ones.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
