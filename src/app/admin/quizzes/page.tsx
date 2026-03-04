"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
        if (!confirm("Are you sure you want to delete this quiz? This will also remove all associated results.")) return;

        const res = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
        if (res.ok) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        } else {
            alert("Delete failed.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b border-gray-200">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-600">←</Link>
                        <h1 className="text-2xl font-bold text-gray-900">Quiz Management</h1>
                    </div>
                    {/* Placeholder for Add New button */}
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-500 transition-all">
                        + New Quiz
                    </button>
                </div>
            </header>

            <main className="flex-1 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Title</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest">Questions</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">Loading...</td></tr>
                            ) : quizzes.map((quiz) => (
                                <tr key={quiz.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">{quiz.title}</div>
                                        <div className="text-xs text-gray-500 uppercase tracking-tighter">{quiz.difficulty}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase">{quiz.category}</span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{quiz.question_count}</div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right space-x-3">
                                        <button className="text-indigo-600 hover:text-indigo-900 text-sm font-bold">Edit</button>
                                        <button
                                            onClick={() => handleDelete(quiz.id)}
                                            className="text-red-600 hover:text-red-900 text-sm font-bold"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
