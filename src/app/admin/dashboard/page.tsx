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
            <main className="flex-1 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 w-full">
                {/* Header */}
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-0.5 w-8 bg-indigo-600 rounded-full"></div>
                            <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Admin Dashboard</span>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Overview</h1>
                    </div>
                    <Link href="/admin/quizzes" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:-translate-y-0.5 transition-all active:scale-95 group">
                        Manage Quizzes <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Stats Grid - 4 columns on large screens */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 transition-all hover:shadow-indigo-500/10 hover:-translate-y-1">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`p-2.5 sm:p-3 rounded-lg ${item.color}`}>
                                    <div className="h-5 w-5">{item.icon}</div>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">{item.name}</p>
                            <p className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight tabular-nums">{item.value}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="h-4 w-4 text-indigo-600" />
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide">Recent Activity</h2>
                            </div>
                        </div>
                        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recentActivity.map((item: any) => (
                                <li key={item.id} className="px-5 py-4 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center text-xs font-bold text-white dark:text-slate-900 flex-shrink-0">
                                                {item.user_name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{item.user_name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="text-indigo-600 dark:text-indigo-400">{item.quiz_title}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums leading-none">
                                                {item.score}<span className="text-slate-300 dark:text-slate-600 mx-0.5">/</span>{item.total_questions}
                                            </p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium mt-0.5 tabular-nums">
                                                {new Date(item.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {recentActivity.length === 0 && (
                                <li className="py-12 text-center">
                                    <p className="text-xs font-medium text-slate-400 dark:text-slate-600">No recent activity</p>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Quiz Management Card */}
                        <div className="bg-indigo-950 dark:bg-indigo-600 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
                            <h3 className="text-lg font-bold mb-2">Quiz Management</h3>
                            <p className="text-xs text-indigo-200/80 mb-4 leading-relaxed">
                                Create and manage quiz content.
                            </p>
                            <Link
                                href="/admin/quizzes"
                                className="block w-full text-center bg-white text-indigo-950 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-50 transition-all hover:-translate-y-0.5 active:scale-95 shadow-lg"
                            >
                                Manage Quizzes
                            </Link>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="h-4 w-4 text-amber-500" />
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Top Performers</h4>
                            </div>
                            <ul className="space-y-3">
                                {topPerformers.map((p: any, i: number) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <span className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                            i === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' :
                                                'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                                            }`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{p.name}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500">{p.quizzes_taken} quizzes</p>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{p.avg_percent}%</span>
                                    </li>
                                ))}
                                {topPerformers.length === 0 && (
                                    <li className="text-center py-4">
                                        <p className="text-xs text-slate-400 dark:text-slate-600">No data yet</p>
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
