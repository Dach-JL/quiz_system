import Link from "next/link";
import sql from "@/lib/db";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BookOpen, Target, Trophy, Clock, Users, ArrowRight } from "lucide-react";

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

    // Calculate rank: count how many users have a higher avg score
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

    // Count how many attempts each quiz has (for participants count)
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
        { label: "Quizzes Taken", value: stats.quizzes_taken, icon: <BookOpen className="h-5 w-5" />, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400" },
        { label: "Avg. Score", value: `${stats.avg_score}%`, icon: <Target className="h-5 w-5" />, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
        { label: "Rank", value: `#${rank}`, icon: <Trophy className="h-5 w-5" />, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back! Ready for a challenge?</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-14">
                    {statCards.map((card, i) => (
                        <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 flex items-center gap-5 shadow-sm">
                            <div className={`p-3 rounded-xl ${card.color}`}>
                                {card.icon}
                            </div>
                            <div>
                                <p className="text-2xl font-black text-slate-900 dark:text-white leading-none tabular-nums">{card.value}</p>
                                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">{card.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Available Quizzes */}
                <div className="mb-8">
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Available Quizzes</h2>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz: any) => (
                        <div key={quiz.id} className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all overflow-hidden">
                            <div className="p-6 flex-1">
                                {/* Category & Difficulty badges */}
                                <div className="flex items-center gap-2 mb-4 flex-wrap">
                                    <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-[11px] font-bold text-slate-600 dark:text-slate-400">
                                        {quiz.category || "General"}
                                    </span>
                                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${quiz.difficulty === 'easy' || quiz.difficulty === 'Beginner'
                                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                                            : quiz.difficulty === 'medium' || quiz.difficulty === 'Intermediate'
                                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400'
                                                : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                                        }`}>
                                        {quiz.difficulty}
                                    </span>
                                </div>

                                {/* Title & Description */}
                                <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug mb-2">{quiz.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6 line-clamp-2">{quiz.description}</p>

                                {/* Meta info */}
                                <div className="flex items-center gap-5 text-xs text-slate-400 dark:text-slate-500 font-bold">
                                    <div className="flex items-center gap-1.5">
                                        <BookOpen className="h-3.5 w-3.5" />
                                        <span>{quiz.question_count} questions</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{(quiz.question_count * 1.5).toFixed(0)} min</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{attemptMap[quiz.id] || 0}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Start Button */}
                            <div className="px-6 pb-6">
                                <Link
                                    href={`/quiz/${quiz.id}`}
                                    className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white rounded-xl py-3.5 font-bold text-sm hover:bg-indigo-500 transition-all active:scale-[0.98]"
                                >
                                    Start Quiz <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
