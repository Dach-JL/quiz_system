import Link from "next/link";
import sql from "@/lib/db";
import { Users, BookOpen, Activity, TrendingUp, ArrowUpRight, Zap, Target } from "lucide-react";

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

    return { stats: stats[0], recentActivity: activities };
}

export default async function AdminDashboard() {
    const { stats, recentActivity } = await getAdminData();

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
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest italic leading-relaxed">System idle. No incoming data streams.</p>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Quick Tools */}
                    <div className="lg:col-span-2 space-y-12">
                        <div className="bg-indigo-950 dark:bg-indigo-600 rounded-[4rem] p-12 text-white shadow-3xl relative overflow-hidden group">
                            <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                            <h3 className="text-3xl font-black mb-6 tracking-tight leading-none">Catalog Sync</h3>
                            <p className="text-base font-bold text-indigo-200/80 mb-12 italic leading-relaxed">
                                Deploy new knowledge clusters or calibrate existing evaluation modules to optimize student ROI.
                            </p>
                            <Link
                                href="/admin/quizzes"
                                className="block w-full text-center bg-white text-indigo-950 py-6 rounded-[2rem] font-black text-base hover:bg-indigo-50 transition-all hover:-translate-y-2 active:scale-95 shadow-2xl"
                            >
                                Enter Management Hub
                            </Link>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-[4rem] border-[6px] border-dashed border-slate-100 dark:border-slate-800 p-12 text-center transition-all hover:border-indigo-600/20">
                            <div className="h-20 w-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center mx-auto mb-8">
                                <Target className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter uppercase leading-none">Performance engine</h4>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold italic leading-relaxed max-w-[200px] mx-auto">Neural processing at 99.9% precision.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
