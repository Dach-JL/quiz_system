import Link from "next/link";
import sql from "@/lib/db";
import { Trophy, Target, ArrowRight, RotateCcw, LayoutDashboard, CheckCircle2, XCircle } from "lucide-react";

async function getResult(id: string) {
    const data = await sql`
        SELECT r.*, q.title as quiz_title
        FROM results r
        JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.id = ${id}
    `;
    return data[0];
}

export default async function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = await getResult(id);

    if (!result) return <div>Result not found</div>;

    const percentage = Math.round((result.score / result.total_questions) * 100);
    const isPassed = percentage >= 60;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Result Card */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12 shadow-xl text-center relative overflow-hidden">
                    {/* Top accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-2 ${isPassed ? 'bg-gradient-to-r from-emerald-500 to-green-500' : 'bg-gradient-to-r from-rose-500 to-red-500'}`}></div>

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center p-5 rounded-2xl mb-6 ${isPassed ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'
                        }`}>
                        {isPassed ? <Trophy className="h-10 w-10" /> : <Target className="h-10 w-10" />}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                        {isPassed ? "Quiz Completed!" : "Keep Practicing"}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">{result.quiz_title}</p>

                    {/* Score Circle */}
                    <div className="relative inline-flex items-center justify-center mb-8">
                        <div className={`absolute inset-0 rounded-full blur-2xl opacity-30 ${isPassed ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                        <div className="relative h-40 w-40 rounded-full border-8 border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-lg">
                            <span className={`text-4xl font-bold ${isPassed ? 'text-emerald-600' : 'text-rose-600'}`}>{percentage}%</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">Score</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto">
                        <div className="bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-xl">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                                <span className="text-2xl font-bold text-emerald-600">{result.score}</span>
                            </div>
                            <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Correct</p>
                        </div>
                        <div className="bg-rose-50 dark:bg-rose-500/10 p-4 rounded-xl">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <XCircle className="h-5 w-5 text-rose-600" />
                                <span className="text-2xl font-bold text-rose-600">{result.total_questions - result.score}</span>
                            </div>
                            <p className="text-xs text-rose-700 dark:text-rose-400 font-medium">Incorrect</p>
                        </div>
                    </div>

                    {/* Message */}
                    <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-md mx-auto">
                        {isPassed
                            ? "Great job! You've demonstrated a solid understanding of the material. Keep up the excellent work!"
                            : "Don't give up! Review the material and try again to improve your score."}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                        >
                            <LayoutDashboard className="h-5 w-5" /> Back to Dashboard
                        </Link>
                        <Link
                            href={`/quiz/${result.quiz_id}`}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                        >
                            <RotateCcw className="h-5 w-5" /> Retry Quiz
                        </Link>
                    </div>
                </div>

                {/* Next Steps Card */}
                <div className="mt-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-xl font-bold mb-2">Continue Your Journey</h3>
                            <p className="text-indigo-100">See how you rank against other learners</p>
                        </div>
                        <div className="flex gap-4">
                            <Link href="/leaderboard" className="flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition-all">
                                View Leaderboard <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
