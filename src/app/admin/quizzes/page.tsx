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
        if (!confirm("Are you sure you want to delete this knowledge cluster? This operation is irreversible.")) return;

        const res = await fetch(`/api/admin/quizzes/${id}`, { method: "DELETE" });
        if (res.ok) {
            setQuizzes(quizzes.filter(q => q.id !== id));
        } else {
            alert("Protocol failure: Delete command rejected.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                <div className="mb-16 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <Link href="/admin/dashboard" className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-all">
                            <ChevronLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">Catalog <br />Terminal</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.35em] mt-4 italic">Registry of available knowledge modules</p>
                        </div>
                    </div>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-3 bg-indigo-600 text-white px-7 py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 transition-all hover:-translate-y-1 active:scale-95">
                        <Plus className="h-5 w-5" /> New knowledge Module
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead className="bg-slate-50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Deployment</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Category</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Modules</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Link Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-10 py-32 text-center text-slate-400 dark:text-slate-600 italic">
                                            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                                            Scanning registry...
                                        </td>
                                    </tr>
                                ) : quizzes.map((quiz) => (
                                    <tr key={quiz.id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-all duration-300">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-6">
                                                <div className="h-12 w-12 rounded-xl bg-slate-900 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-white group-hover:bg-indigo-600 transition-colors">
                                                    <LayoutGrid className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">{quiz.title}</div>
                                                    <div className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-1 italic">{quiz.difficulty}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">{quiz.category}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                                                <Layers className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                                <div className="text-sm font-black tabular-nums">{quiz.question_count}</div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right space-x-6">
                                            <button className="text-slate-400 dark:text-slate-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                                <Edit3 className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(quiz.id)}
                                                className="text-slate-400 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-500 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
