import Link from "next/link";
import sql from "@/lib/db";
import { BrainCircuit, Timer, Trophy } from "lucide-react";

async function getQuizzes() {
    const data = await sql`
        SELECT q.*, COUNT(qs.id) as question_count
        FROM quizzes q
        LEFT JOIN questions qs ON q.id = qs.quiz_id
        GROUP BY q.id
    `;
    return data;
}

export default async function DashboardPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Knowledge Clusters</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Command <br />Center</h1>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400">
                                <Timer className="h-6 w-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Time</p>
                                <p className="text-xl font-black text-slate-900 dark:text-white">12.5h</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz: any) => (
                        <div key={quiz.id} className="group relative flex flex-col overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl transition-all hover:shadow-indigo-500/10 hover:-translate-y-2 border border-slate-100 dark:border-slate-800">
                            <div className="p-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="p-4 bg-indigo-600 rounded-[1.5rem] group-hover:scale-110 transition-transform">
                                        <BrainCircuit className="h-6 w-6 text-white" />
                                    </div>
                                    <span className={`inline-flex items-center rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ring-1 ring-inset ${quiz.difficulty === 'easy' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400' :
                                            quiz.difficulty === 'medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400' :
                                                'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400'
                                        }`}>
                                        {quiz.difficulty}
                                    </span>
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-4">{quiz.title}</h3>
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed italic mb-8">{quiz.description}</p>

                                <div className="flex items-center gap-6 text-slate-400 dark:text-slate-500">
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{quiz.question_count}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">Modules</span>
                                    </div>
                                    <div className="w-px h-8 bg-slate-100 dark:bg-slate-800"></div>
                                    <div className="flex flex-col">
                                        <span className="text-lg font-black text-slate-900 dark:text-white leading-none">{(quiz.question_count * 1.5).toFixed(0)}m</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest mt-1">Est. Time</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-auto px-10 pb-10">
                                <Link
                                    href={`/quiz/${quiz.id}`}
                                    className="block w-full text-center bg-indigo-600 text-white rounded-[2rem] py-5 font-black text-sm shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all active:scale-95 group-hover:bg-indigo-700"
                                >
                                    Initiate Deployment
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
