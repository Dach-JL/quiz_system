"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit3, ChevronLeft, LayoutGrid, Layers, Loader2 } from "lucide-react";

export default function QuizManagement() {
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = async () => {
        const res = await fetch("/api/quizzes");
        if (res.ok) {
            const data = await res.json();
            setQuizzes(data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this quiz? This cannot be undone.")) return;

        const res = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
        if (res.ok) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        } else {
            alert("Failed to delete quiz.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                            <ChevronLeft className="h-5 w-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Quiz Management</h1>
                            <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Create and manage your quizzes</p>
                        </div>
                    </div>
                    <Link href="/admin/quizzes/new" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25">
                        <Plus className="h-5 w-5" /> New Quiz
                    </Link>
                </div>

                {/* Quiz Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Quiz</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden sm:table-cell">Category</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide hidden md:table-cell">Questions</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <Loader2 className="h-10 w-10 animate-spin text-slate-400 mx-auto mb-4" />
                                            <p className="text-slate-500 dark:text-slate-400 text-sm">Loading quizzes...</p>
                                        </td>
                                    </tr>
                                ) : quizzes.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-16 text-center">
                                            <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
                                                <LayoutGrid className="h-8 w-8 text-slate-400" />
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 font-medium mb-2">No quizzes yet</p>
                                            <Link href="/admin/quizzes/new" className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:underline">
                                                Create your first quiz →
                                            </Link>
                                        </td>
                                    </tr>
                                ) : (
                                    quizzes.map((quiz) => (
                                        <tr key={quiz.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white flex-shrink-0">
                                                        <LayoutGrid className="h-6 w-6" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-slate-900 dark:text-white">{quiz.title}</p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">{quiz.difficulty}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden sm:table-cell">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                                                    {quiz.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                                                    <Layers className="h-4 w-4" />
                                                    <span className="font-medium">{quiz.question_count}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/quizzes/${quiz.id}/edit`}
                                                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit3 className="h-5 w-5" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(quiz.id)}
                                                        className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
