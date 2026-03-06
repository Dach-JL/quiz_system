import Link from "next/link";
import sql from "@/lib/db";
import { Trophy, ArrowRight, Crown, Medal, Star } from "lucide-react";

async function getLeaderboard() {
    const data = await sql`
        SELECT
            u.id as user_id,
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
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-5xl px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl text-white shadow-lg shadow-amber-500/25 mb-6">
                        <Trophy className="h-8 w-8" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-3">Leaderboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                        Top performers across all quizzes. Think you can make it to the top?
                    </p>
                </div>

                {/* Top 3 Podium */}
                {rankings.length >= 3 && (
                    <div className="grid grid-cols-3 gap-4 mb-12 max-w-2xl mx-auto">
                        {/* 2nd Place */}
                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg mb-4">
                                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-slate-400 to-slate-500 flex items-center justify-center text-white text-xl font-bold mb-3">
                                    {rankings[1]?.username.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-white truncate">{rankings[1]?.username}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{rankings[1]?.percentage}%</p>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-slate-400">
                                <Medal className="h-5 w-5" />
                                <span className="text-sm font-semibold">2nd</span>
                            </div>
                        </div>

                        {/* 1st Place */}
                        <div className="text-center -mt-8">
                            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-xl shadow-amber-500/25 mb-4">
                                <div className="flex items-center justify-center gap-1 mb-3">
                                    <Crown className="h-6 w-6 text-white" />
                                </div>
                                <div className="h-20 w-20 mx-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold mb-3">
                                    {rankings[0]?.username.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-semibold text-white truncate">{rankings[0]?.username}</p>
                                <p className="text-sm text-amber-100">{rankings[0]?.percentage}%</p>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-amber-500">
                                <Crown className="h-5 w-5" />
                                <span className="text-sm font-semibold">1st</span>
                            </div>
                        </div>

                        {/* 3rd Place */}
                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg mb-4">
                                <div className="h-16 w-16 mx-auto rounded-full bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white text-xl font-bold mb-3">
                                    {rankings[2]?.username.charAt(0).toUpperCase()}
                                </div>
                                <p className="font-semibold text-slate-900 dark:text-white truncate">{rankings[2]?.username}</p>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{rankings[2]?.percentage}%</p>
                            </div>
                            <div className="flex items-center justify-center gap-1 text-orange-600">
                                <Medal className="h-5 w-5" />
                                <span className="text-sm font-semibold">3rd</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Rankings Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Rank</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">User</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Quiz</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {rankings.map((row: any, index: number) => (
                                    <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {index === 0 ? <Crown className="h-5 w-5 text-amber-500" /> :
                                                    index === 1 ? <Medal className="h-5 w-5 text-slate-400" /> :
                                                        index === 2 ? <Medal className="h-5 w-5 text-orange-600" /> :
                                                            <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 w-5 text-center">{index + 1}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                                                    {row.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 dark:text-white">{row.username}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 sm:hidden">{row.quiz_title}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                            <p className="text-sm text-slate-600 dark:text-slate-400">{row.quiz_title}</p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                    {row.score}/{row.total_questions}
                                                </span>
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${row.percentage >= 80 ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                        row.percentage >= 60 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                                            'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                                    }`}>
                                                    {row.percentage}%
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {rankings.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                                                <Trophy className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium">No results yet. Be the first to take a quiz!</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Link href="/dashboard" className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-500 transition-colors">
                        Take a Quiz <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
