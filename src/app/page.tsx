import Link from "next/link";
import { BrainCircuit, Trophy, Target, Zap, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      <main>
        {/* Decorative Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10 opacity-20 dark:opacity-30">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[120px] -mr-64 -mt-64"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-32 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-12 flex justify-center animate-fade-in">
              <div className="relative rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 ring-2 ring-indigo-600/10 dark:text-indigo-400 dark:ring-indigo-400/20 bg-indigo-50/50 dark:bg-indigo-500/5 backdrop-blur-sm">
                System Version 2.0 Is Live <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
                <Link href="/register" className="font-black text-indigo-600 dark:text-indigo-400 hover:underline">
                  Join Beta <ArrowRight className="inline h-3 w-3 ml-1" />
                </Link>
              </div>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.9] mb-10">
              MASTER <br /><span className="text-indigo-600 underline decoration-indigo-200 dark:decoration-indigo-500/30 decoration-[8px] sm:decoration-[12px] underline-offset-[12px]">KNOWLEDGE.</span>
            </h1>

            <p className="mt-8 text-lg sm:text-xl leading-relaxed text-slate-600 dark:text-slate-400 font-bold max-w-2xl mx-auto italic">
              Experience the world's most advanced evaluation engine. Built for high-performance learners and elite institutions.
            </p>

            <div className="mt-20 flex flex-col sm:flex-row items-center justify-center gap-8">
              <Link
                href="/register"
                className="w-full sm:w-auto rounded-2xl bg-indigo-600 px-8 py-3.5 text-base font-black text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)] dark:shadow-none hover:bg-indigo-500 hover:scale-105 transition-all active:scale-95"
              >
                Start Evaluation
              </Link>
              <Link href="/login" className="flex items-center gap-3 text-base font-black text-slate-900 dark:text-white group py-4">
                Access Terminal <div className="p-2 border-2 border-slate-900 dark:border-white rounded-xl transition-all group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900"><ArrowRight className="h-5 w-5" /></div>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <Zap className="h-7 w-7" />, title: "Quantum Feedback", desc: "Our neural routing engine delivers grading results in less than 40ms with deep error diagnostics." },
              { icon: <Trophy className="h-7 w-7" />, title: "Global Nexus", desc: "Collaborate and compete across a decentralized leaderboard of 50,000+ active scholars." },
              { icon: <Target className="h-7 w-7" />, title: "Growth Analytics", desc: "Visualization of your cognitive mapping and knowledge retention over long-form session cycles." },
              { icon: <ShieldCheck className="h-7 w-7" />, title: "Trusted Core", desc: "Enterprise-grade encryption protecting your academic credentials and private learning data." },
              { icon: <BrainCircuit className="h-7 w-7" />, title: "Adaptive Logic", desc: "Questions that evolve. Our system learns your triggers and challenges your weak points." },
              { icon: <Sparkles className="h-7 w-7" />, title: "Premium Design", desc: "A sleek, distraction-free environment optimized for deep work and peak concentration." }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-all hover:shadow-2xl hover:-translate-y-2">
                <div className="mb-6 inline-flex p-4 bg-indigo-600 rounded-xl text-white shadow-xl shadow-indigo-100 dark:shadow-none group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight leading-none">{feature.title}</h3>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/20 py-24 px-6 text-center">
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-8 italic">Validated by Industry Leaders</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40 dark:opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">NEXUS</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">ORBITAL</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">VOID.DEV</span>
            <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">CORE_X</span>
          </div>
        </section>
      </main>
    </div>
  );
}
