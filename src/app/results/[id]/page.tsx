import Link from "next/link";
import sql from "@/lib/db";
import { notFound } from "next/navigation";

async function getResult(id: string) {
    const [result] = await sql`
        SELECT r.*, q.title as quiz_title, q.description as quiz_description
        FROM results r
        JOIN quizzes q ON r.quiz_id = q.id
        WHERE r.id = ${id}
    `;
    return result;
}

export default async function ResultsPage({ params }: { params: { id: string } }) {
    const result = await getResult(params.id);

    if (!result) {
        notFound();
    }

    const percentage = Math.round((result.score / result.total_questions) * 100);
    const isPassed = percentage >= 60; // Simple pass criteria

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-2xl mb-6">
                        <span className="text-4xl">
                            {isPassed ? "🎉" : "💪"}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
                    <p className="text-gray-500 mb-8">{result.quiz_title}</p>

                    <div className="relative inline-flex items-center justify-center mb-8">
                        {/* Circular Score Visual (Simple Tailwind hack) */}
                        <div className="h-48 w-48 rounded-full border-8 border-gray-100 flex flex-col items-center justify-center">
                            <span className="text-5xl font-extrabold text-indigo-600">{percentage}%</span>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Score</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                            <span className="block text-2xl font-bold text-green-700">{result.score}</span>
                            <span className="text-xs font-bold text-green-600 uppercase tracking-wider">Correct</span>
                        </div>
                        <div className="bg-red-50 p-4 rounded-2xl border border-red-100">
                            <span className="block text-2xl font-bold text-red-700">{result.total_questions - result.score}</span>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Incorrect</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-lg font-medium text-gray-700">
                            {isPassed
                                ? "Excellent work! You've successfully passed the quiz."
                                : "Good effort! Keep practicing to improve your score."}
                        </p>

                        <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all"
                            >
                                Back to Dashboard
                            </Link>
                            <Link
                                href={`/quiz/${result.quiz_id}`}
                                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border-2 border-gray-100 rounded-xl font-bold hover:bg-gray-50 transition-all"
                            >
                                Try Again
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Performance Message */}
                <div className="mt-8 bg-indigo-900 rounded-2xl p-6 text-white text-center">
                    <p className="text-indigo-200 text-sm font-medium">Want to see where you stand?</p>
                    <Link href="/leaderboard" className="mt-2 inline-block text-white font-bold border-b-2 border-indigo-400 hover:border-white transition-all">
                        Check the Global Leaderboard →
                    </Link>
                </div>
            </div>
        </div>
    );
}
