import Link from "next/link";
import sql from "@/lib/db";
import { Trophy, ArrowUpRight, Crown, Medal } from "lucide-react";

async function getLeaderboard() {
    const data = await sql`
        SELECT 
            u.name as username, 
            q.title as quiz_title, 
            r.score, 
            r.total_questions,
            r.completed_at,
            ROUND((CAST(r.score AS FLOAT) / r.total_questions * 100)) as percentage
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN quizzes q ON r.quiz_id = q.id
        ORDER BY percentage DESC, r.completed_at ASC
        LIMIT 20
    `;
    return data;
}

export default async function LeaderboardPage() {
    const rankings = await getLeaderboard();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
                <div className="text-center mb-20 animate-fade-in">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-[2rem] text-white shadow-2xl mb-8">
                        <Trophy className="h-8 w-8" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-6">Leaderboard</h1>
                    <p className="text-base font-bold text-slate-500 dark:text-slate-400 italic max-w-lg mx-auto underline decoration-indigo-500/20 underline-offset-8">
                        Top scorers across all quizzes. Can you make it to the top?
                    </p>
                </div>

                <div className="overflow-hidden rounded-[3rem] bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead className="bg-slate-50/80 dark:bg-slate-800/50 backdrop-blur-sm">
                                <tr>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Rank</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">User</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Quiz</th>
                                    <th scope="col" className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Score</th>
                                    <th scope="col" className="px-8 py-6 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Percentage</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800 bg-white dark:bg-transparent">
                                {rankings.map((row: any, index: number) => (
                                    <tr key={index} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                                        <td className="whitespace-nowrap px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                {index === 0 ? <Crown className="h-6 w-6 text-amber-500" /> :
                                                    index === 1 ? <Medal className="h-6 w-6 text-slate-400" /> :
                                                        index === 2 ? <Medal className="h-6 w-6 text-amber-700" /> :
                                                            <span className="text-sm font-black text-slate-300 dark:text-slate-700 tabular-nums">#{index + 1}</span>}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-8">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-xs font-black text-white dark:text-slate-900 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {row.username.charAt(0)}
                                                </div>
                                                <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{row.username}</div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-8">
                                            <div className="text-sm font-bold text-slate-500 dark:text-slate-400 italic">{row.quiz_title}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-8">
                                            <div className="text-sm font-black text-slate-900 dark:text-white font-mono">
                                                {row.score}<span className="text-slate-200 dark:text-slate-700 mx-1">/</span>{row.total_questions}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-8 py-8 text-right">
                                            <span className={`inline-flex items-center rounded-2xl px-4 py-1.5 text-xs font-black ring-1 ring-inset ${row.percentage >= 80 ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-400/10 dark:text-emerald-400' :
                                                row.percentage >= 60 ? 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-400' :
                                                    'bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-400/10 dark:text-rose-400'
                                                }`}>
                                                {row.percentage}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {rankings.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-24 text-center">
                                            <p className="text-sm font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic">No results yet. Be the first to take a quiz!</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:gap-4 transition-all">
                        Take a Quiz <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
