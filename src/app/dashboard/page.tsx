import Link from "next/link";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookOpen, Target, Trophy, Clock, Users, ArrowRight, Play } from "lucide-react";

async function getDashboardData(userId: number) {
    const quizzes = await sql`
        SELECT q.*, COUNT(qs.id) as question_count
        FROM quizzes q
        LEFT JOIN questions qs ON q.id = qs.quiz_id
        GROUP BY q.id
        ORDER BY q.created_at DESC
    `;

    const userStats = await sql`
        SELECT
            COUNT(*) as quizzes_taken,
            COALESCE(ROUND(AVG(score * 100.0 / NULLIF(total_questions, 0))::numeric, 0), 0) as avg_score
        FROM results
        WHERE user_id = ${userId}
    `;

    const rankResult = await sql`
        SELECT COUNT(*) + 1 as rank FROM (
            SELECT user_id, AVG(score * 100.0 / NULLIF(total_questions, 0)) as avg
            FROM results
            GROUP BY user_id
            HAVING AVG(score * 100.0 / NULLIF(total_questions, 0)) > (
                SELECT COALESCE(AVG(score * 100.0 / NULLIF(total_questions, 0)), 0)
                FROM results WHERE user_id = ${userId}
            )
        ) as better_users
    `;

    const quizAttempts = await sql`
        SELECT quiz_id, COUNT(DISTINCT user_id) as participants
        FROM results
        GROUP BY quiz_id
    `;

    const attemptMap: Record<number, number> = {};
    quizAttempts.forEach((a: any) => { attemptMap[a.quiz_id] = Number(a.participants); });

    return {
        quizzes,
        stats: userStats[0],
        rank: rankResult[0]?.rank || '-',
        attemptMap
    };
}

export default async function DashboardPage() {
    const session = await getSession();
    if (!session) redirect("/login");

    const { quizzes, stats, rank, attemptMap } = await getDashboardData(session.user.id);

    const statCards = [
        { label: "Quizzes Taken", value: stats.quizzes_taken, icon: <BookOpen className="h-5 w-5" />, color: "from-blue-500 to-cyan-500", bg: "bg-blue-50 dark:bg-blue-500/10" },
        { label: "Avg. Score", value: `${stats.avg_score}%`, icon: <Target className="h-5 w-5" />, color: "from-amber-500 to-orange-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
        { label: "Your Rank", value: `#${rank}`, icon: <Trophy className="h-5 w-5" />, color: "from-emerald-500 to-green-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back! Ready to continue learning?</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg shadow-slate-200/50 dark:shadow-none">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${card.bg}`}>
                                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${card.color}`}>
                                        <div className="h-5 w-5">{card.icon}</div>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{card.value}</p>
                                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Available Quizzes */}
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Available Quizzes</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Choose a quiz to test your knowledge</p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz: any) => (
                        <div key={quiz.id} className="group flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 transition-all hover:-translate-y-1 overflow-hidden">
                            <div className="p-6 flex-1">
                                {/* Category & Difficulty badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        {quiz.category || "General"}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${quiz.difficulty === 'easy' || quiz.difficulty === 'Beginner'
                                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : quiz.difficulty === 'medium' || quiz.difficulty === 'Intermediate'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                        }`}>
                                        {quiz.difficulty}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug mb-2">{quiz.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-2">{quiz.description}</p>

                                {/* Meta info */}
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="h-4 w-4" />
                                        <span>{quiz.question_count} questions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-4 w-4" />
                                        <span>{(quiz.question_count * 1.5).toFixed(0)} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-4 w-4" />
                                        <span>{attemptMap[quiz.id] || 0} took</span>
                                    </div>
                                </div>
                            </div>

                            {/* Start Button */}
                            <div className="px-6 pb-6">
                                <Link
                                    href={`/quiz/${quiz.id}`}
                                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white rounded-xl py-3 font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                                >
                                    <Play className="h-4 w-4" /> Start Quiz
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {quizzes.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                            <BookOpen className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No quizzes available</h3>
                        <p className="text-slate-600 dark:text-slate-400">Check back later for new content</p>
                    </div>
                )}
            </main>
        </div>
    );
}
