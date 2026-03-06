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
        { name: 'Total Users', value: stats.total_users, icon: <Users className="h-5 w-5" />, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { name: 'Total Quizzes', value: stats.total_quizzes, icon: <BookOpen className="h-5 w-5" />, color: "from-indigo-500 to-purple-500", bg: "bg-indigo-50 dark:bg-indigo-500/10" },
        { name: 'Total Attempts', value: stats.total_attempts, icon: <Activity className="h-5 w-5" />, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        { name: 'Avg. Score', value: `${stats.avg_score}%`, icon: <TrendingUp className="h-5 w-5" />, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                        <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your quiz platform</p>
                    </div>
                    <Link href="/admin/quizzes" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                        Manage Quizzes <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                    {statCards.map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2.5 rounded-xl ${item.bg}`}>
                                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${item.color}`}>
                                        <div className="h-5 w-5">{item.icon}</div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{item.value}</p>
                            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">{item.name}</p>
                        </div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 flex items-center gap-2">
                            <Zap className="h-5 w-5 text-indigo-600" />
                            <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Recent Activity</h2>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-700">
                            {recentActivity.map((item: any) => (
                                <div key={item.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                                                {item.user_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-slate-900 dark:text-white truncate">{item.user_name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{item.quiz_title}</p>
                                            </div>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-slate-900 dark:text-white tabular-nums">
                                                {item.score}<span className="text-slate-400 dark:text-slate-500">/{item.total_questions}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                {new Date(item.completed_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {recentActivity.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Action Card */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="text-lg font-bold mb-2">Quiz Management</h3>
                            <p className="text-sm text-indigo-100 mb-4">Create and manage quiz content for your users.</p>
                            <Link
                                href="/admin/quizzes"
                                className="block w-full text-center bg-white text-indigo-600 py-2.5 rounded-xl font-semibold hover:bg-indigo-50 transition-all"
                            >
                                Manage Quizzes
                            </Link>
                        </div>

                        {/* Top Performers */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                <h4 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide">Top Performers</h4>
                            </div>
                            <div className="space-y-4">
                                {topPerformers.map((p: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${i === 0 ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                                i === 1 ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' :
                                                    'bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400'
                                            }`}>
                                            {i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-slate-900 dark:text-white truncate text-sm">{p.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{p.quizzes_taken} quizzes</p>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{p.avg_percent}%</span>
                                    </div>
                                ))}
                                {topPerformers.length === 0 && (
                                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No data yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
