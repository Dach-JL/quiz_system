import Link from "next/link";
import sql from "@/lib/db";

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
        { name: 'Total Users', value: stats.total_users, icon: '👤', color: 'bg-blue-50 text-blue-700' },
        { name: 'Total Quizzes', value: stats.total_quizzes, icon: '📝', color: 'bg-indigo-50 text-indigo-700' },
        { name: 'Total Attempts', value: stats.total_attempts, icon: '🔥', color: 'bg-green-50 text-green-700' },
        { name: 'Avg. Score', value: stats.avg_score, icon: '📈', color: 'bg-yellow-50 text-yellow-700' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <span className="p-2 bg-indigo-600 rounded-lg text-white text-xs uppercase tracking-widest px-3 font-black">Admin</span>
                        Dashboard
                    </h1>
                    <nav className="flex gap-4">
                        <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">User View</Link>
                        <Link href="/admin/quizzes" className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors">Manage Quizzes</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
                    {statCards.map((item) => (
                        <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
                            <div className="flex items-center justify-between mb-4">
                                <span className={`p-3 rounded-xl text-xl ${item.color}`}>{item.icon}</span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{item.name}</p>
                            <p className="mt-2 text-3xl font-black text-gray-900">{item.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Activity */}
                    <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Recent User Activity</h2>
                            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">Live Feed</span>
                        </div>
                        <ul className="divide-y divide-gray-100">
                            {recentActivity.map((item) => (
                                <li key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700">
                                                {item.user_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{item.user_name}</p>
                                                <p className="text-xs text-gray-500">Completed <span className="font-medium text-gray-700">{item.quiz_title}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black text-indigo-600">{item.score}/{item.total_questions}</p>
                                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter mt-0.5">
                                                {new Date(item.completed_at).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                            {recentActivity.length === 0 && (
                                <li className="p-12 text-center text-gray-400 italic text-sm">No activity reported yet.</li>
                            )}
                        </ul>
                    </div>

                    {/* Quick Controls */}
                    <div className="space-y-6">
                        <div className="bg-indigo-900 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                            <h3 className="text-xl font-black mb-4">Quiz Control</h3>
                            <p className="text-indigo-200 text-sm mb-8 leading-relaxed">
                                Expand your catalog by adding new challenges or updating existing questions.
                            </p>
                            <Link
                                href="/admin/quizzes"
                                className="block w-full text-center bg-white text-indigo-900 py-4 rounded-xl font-black text-sm hover:bg-indigo-50 transition-all active:scale-95"
                            >
                                Manage Knowledge Base
                            </Link>
                        </div>

                        <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
                            <span className="text-4xl mb-4 block">🧪</span>
                            <h4 className="text-sm font-bold text-gray-900 mb-2">Automated Grading</h4>
                            <p className="text-xs text-gray-500">System is currently processing results in real-time with 100% accuracy.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
