import Link from "next/link";

async function getQuizzes() {
    // We can call the API or the DB directly since this is a server component
    // Calling the API internally for consistency with the plan
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/quizzes`, { cache: 'no-store' });
    if (!res.ok) return [];
    return res.json();
}

export default async function DashboardPage() {
    const quizzes = await getQuizzes();

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <header className="bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz: any) => (
                        <div key={quiz.id} className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100">
                            <div className="p-6">
                                <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${quiz.difficulty === 'easy' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                            quiz.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                                'bg-red-50 text-red-700 ring-red-600/20'
                                        }`}>
                                        {quiz.difficulty.toUpperCase()}
                                    </span>
                                    <span className="text-xs text-gray-500">{quiz.category}</span>
                                </div>
                                <h3 className="mt-4 text-xl font-bold text-gray-900">{quiz.title}</h3>
                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{quiz.description}</p>
                            </div>
                            <div className="mt-auto border-t border-gray-100 bg-gray-50/50 p-6 flex items-center justify-between">
                                <span className="text-sm text-gray-500 font-medium">{quiz.question_count} Questions</span>
                                <Link
                                    href={`/quiz/${quiz.id}`}
                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                                >
                                    Start Quiz
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
