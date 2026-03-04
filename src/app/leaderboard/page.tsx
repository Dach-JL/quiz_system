import Link from "next/link";
import sql from "@/lib/db";

async function getLeaderboard() {
    // We can call the DB directly here as it's a server component
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
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leaderboard</h1>
                        <p className="mt-2 text-sm text-gray-500 font-medium italic">Global Top Performers</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 flex items-center gap-1">
                        ← Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-900/5">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Rank</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">User</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Quiz</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Score</th>
                                <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {rankings.map((row: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="whitespace-nowrap px-6 py-5 text-sm font-bold">
                                        <div className="flex items-center gap-2">
                                            {index === 0 ? <span className="text-xl">🥇</span> :
                                                index === 1 ? <span className="text-xl">🥈</span> :
                                                    index === 2 ? <span className="text-xl">🥉</span> :
                                                        <span className="text-gray-400">#{index + 1}</span>}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <div className="text-sm font-bold text-gray-900">{row.username}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <div className="text-sm text-gray-500">{row.quiz_title}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5">
                                        <div className="text-sm font-medium text-gray-900">
                                            {row.score} / {row.total_questions}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-5 text-right">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-bold ring-1 ring-inset ${row.percentage >= 80 ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                row.percentage >= 60 ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                                    'bg-red-50 text-red-700 ring-red-600/20'
                                            }`}>
                                            {row.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {rankings.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-500 italic">
                                        No results found. Be the first to take a quiz!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
