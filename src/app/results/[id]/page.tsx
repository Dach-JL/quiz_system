import Link from "next/link";
import sql from "@/lib/db";
import { Trophy, Target, ArrowRight, RotateCcw, LayoutDashboard, Share2 } from "lucide-react";

async function getResult(id: string) {
    const data = await sql`
        SELECT r.*, q.title as quiz_title
        FROM results r
        JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.id = ${id}
    `;
    return data[0];
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getResult(id);

    if (!result) return <div>Result not found</div>;

    const percentage = Math.round((result.score / result.total_questions) * 100);
    const isPassed = percentage >= 60;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="mx-auto max-w-4xl">
                <div className="bg-white dark:bg-slate-900 p-10 sm:p-16 rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
                    {/* Background Accents */}
                    <div className={`absolute top-0 left-0 w-full h-4 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>

                    <div className="relative z-10">
                        <div className={`inline-flex items-center justify-center p-8 rounded-[2.5rem] mb-12 shadow-2xl ${isPassed ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 shadow-emerald-200/50' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 shadow-rose-200/50'
                            }`}>
                            {isPassed ? <Trophy className="h-12 w-12" /> : <Target className="h-12 w-12" />}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none">
                            {isPassed ? "ELITE STATUS" : "LEVEL FAILED"}
                        </h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em] mb-16 italic">Module Analysis: {result.quiz_title}</p>

                        <div className="relative inline-flex items-center justify-center mb-20">
                            <div className={`absolute inset-0 rounded-full blur-[80px] opacity-30 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            <div className="relative h-48 w-48 rounded-full border-[12px] border-slate-50 dark:border-slate-800 flex flex-col items-center justify-center bg-white dark:bg-slate-900 shadow-2xl">
                                <span className={`text-5xl font-black tracking-tighter ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>{percentage}%</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-2">Proficiency</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-16 max-w-2xl mx-auto">
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                                <span className="block text-4xl font-black text-slate-900 dark:text-white tabular-nums mb-2">{result.score}</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Validated Assets</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:scale-105">
                                <span className="block text-4xl font-black text-slate-900 dark:text-white tabular-nums mb-2">{result.total_questions - result.score}</span>
                                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Resource Gaps</span>
                            </div>
                        </div>

                        <p className="text-xl font-bold text-slate-600 dark:text-slate-400 leading-relaxed max-w-lg mx-auto italic underline decoration-slate-200 dark:decoration-slate-800 decoration-4 underline-offset-8 mb-20 whitespace-pre-line">
                            {isPassed
                                ? "Critical mass achieved.\nYour cognitive signature has been updated in the global registry."
                                : "Data corruption detected.\nRecalibrate your focus and re-run the simulation to proceed."}
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95"
                            >
                                <LayoutDashboard className="h-5 w-5" /> Return to Command
                            </Link>
                            <Link
                                href={`/quiz/${result.quiz_id}`}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-4 border-slate-900 dark:border-white rounded-2xl font-black text-base hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-950 transition-all active:scale-95"
                            >
                                <RotateCcw className="h-5 w-5" /> Retry Simulation
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Social Share / Next Steps */}
                <div className="mt-16 bg-slate-900 dark:bg-indigo-600 rounded-[4rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-3xl">
                    <div className="text-center md:text-left">
                        <h4 className="text-3xl font-black tracking-tight mb-2">Claim Your Rank</h4>
                        <p className="text-slate-400 dark:text-indigo-100 font-bold italic underline decoration-2 decoration-white/20 underline-offset-4">Compare your results with the 1%.</p>
                    </div>
                    <div className="flex gap-6">
                        <Link href="/leaderboard" className="flex items-center gap-3 bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-sm hover:scale-105 transition-all">
                            Global Rankings <ArrowRight className="h-4 w-4" />
                        </Link>
                        <button className="p-5 bg-slate-800 dark:bg-indigo-700/50 rounded-2xl hover:bg-slate-700 transition-all">
                            <Share2 className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
