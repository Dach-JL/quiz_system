import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import sql from "@/lib/db";
import { Users, BookOpen, Activity, TrendingUp, ArrowUpRight, Zap, Trophy } from "lucide-react";

async function getAdminData() {
    const stats = await sql`
        SELECT 
            (SELECT COUNT(*) FROM users) as total_users,
            (SELECT COUNT(*) FROM quizzes) as total_quizzes,
            (SELECT COUNT(*) FROM results) as total_attempts,
            (SELECT COALESCE(ROUND(AVG(score)::numeric, 2), 0) FROM results) as avg_score
    `;

    const activities = await sql`
        SELECT 
            r.id, u.name as user_name, q.title as quiz_title, 
            r.score, r.total_questions, r.completed_at
        FROM results r
        JOIN users u ON r.user_id = u.id
        JOIN quizzes q ON r.quiz_id = q.id
        ORDER BY r.completed_at DESC
        LIMIT 5
    `;
    const topPerformers = await sql`
        SELECT u.name, COUNT(r.id) as quizzes_taken, 
               ROUND(AVG(r.score * 100.0 / NULLIF(r.total_questions, 0))::numeric, 1) as avg_percent
        FROM results r
        JOIN users u ON r.user_id = u.id
        GROUP BY u.id, u.name
        ORDER BY avg_percent DESC
        LIMIT 3
    `;

    return { stats: stats[0], recentActivity: activities, topPerformers };
}

export default async function AdminDashboard() {
    const session = await getSession();
    if (!session || session.user.role !== 'admin') {
        redirect("/dashboard");
    }

    const { stats, recentActivity, topPerformers } = await getAdminData();

    const statCards = [
        { name: 'Total Users', value: stats.total_users, icon: <Users />, color: 'bg-blue-50 text-blue-700 dark:bg-blue-400/10 dark:text-blue-200' },
        { name: 'Total Modules', value: stats.total_quizzes, icon: <BookOpen />, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-200' },
        { name: 'Total Syncs', value: stats.total_attempts, icon: <Activity />, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-200' },
        { name: 'Efficiency', value: `${stats.avg_score}%`, icon: <TrendingUp />, color: 'bg-amber-50 text-amber-700 dark:bg-amber-400/10 dark:text-amber-200' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-500">
            <main className="flex-1 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                <div className="mb-20 flex flex-col sm:flex-row items-center justify-between gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
                            <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em]">System Level: Root</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Admin Dashboard</h1>
                    </div>
                    <Link href="/admin/quizzes" className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 hover:-translate-y-1 transition-all active:scale-95 group">
                        Manage Knowledge Terminal <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-20">
                    {statCards.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-all hover:shadow-indigo-500/10 hover:-translate-y-2">
                            <div className="flex items-center justify-between mb-8">
                                <div className={`p-4 rounded-xl ${item.color}`}>
                                    {item.icon}
                                </div>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">{item.name}</p>
                            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Recent Activity */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-[4rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-12 py-10 border-b border-slate-50 dark:border-slate-800 bg-slate-50 text-slate-900 dark:bg-slate-800/50 dark:text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Zap className="h-5 w-5 text-indigo-600" />
                                <h2 className="text-2xl font-black tracking-tight leading-none uppercase tracking-[0.05em]">System activity</h2>
                            </div>
                        </div>
                        <ul className="divide-y divide-slate-50 dark:divide-slate-800">
                            {recentActivity.map((item: any) => (
                                <li key={item.id} className="p-12 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-900 dark:bg-white flex items-center justify-center text-sm font-black text-white dark:text-slate-900">
                                                {item.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1">{item.user_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic">
                                                    Module Sync: <span className="text-indigo-600 dark:text-indigo-400">{item.quiz_title}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right">
                                            <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums leading-none">
                                                {item.score}<span className="text-slate-200 dark:text-slate-700 mx-1">/</span>{item.total_questions}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest mt-2 tabular-nums">
                                                {new Date(item.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {recentActivity.length === 0 && (
                                <li className="p-24 text-center">
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic leading-relaxed">No recent activity yet.</p>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Quick Tools */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-indigo-950 dark:bg-indigo-600 rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden group">
                            <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-3xl font-black mb-6 tracking-tight leading-none">Quiz Management</h3>
                            <p className="text-base font-bold text-indigo-200/80 mb-12 italic leading-relaxed">
                                Create new quizzes or edit existing ones to keep your content fresh and engaging.
                            </p>
                            <Link
                                href="/admin/quizzes"
                                className="block w-full text-center bg-white text-indigo-950 py-6 rounded-[2rem] font-black text-base hover:bg-indigo-50 transition-all hover:-translate-y-2 active:scale-95 shadow-2xl"
                            >
                                Manage Quizzes
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border border-slate-100 dark:border-slate-800 p-12 shadow-2xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-[0.05em]">Top Performers</h4>
                            </div>
                            <ul className="space-y-6">
                                {topPerformers.map((p: any, i: number) => (
                                    <li key={i} className="flex items-center gap-5">
                                        <span className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                            i === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                                'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                                            }`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{p.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 italic">{p.quizzes_taken} quizzes taken</p>
                                        </div>
                                        <span className="text-lg font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{p.avg_percent}%</span>
                                    </li>
                                ))}
                                {topPerformers.length === 0 && (
                                    <li className="text-center py-6">
                                        <p className="text-sm font-bold text-slate-400 dark:text-slate-600 italic">No data yet.</p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
