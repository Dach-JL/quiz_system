"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Plus, Trash2, Save, Loader2, BookOpen, AlertCircle, RefreshCw, Clock } from "lucide-react";

interface Question {
    id?: number;
    question_text: string;
    options: string[];
    correct_answer: number;
}

interface QuizData {
    id?: number;
    title: string;
    description: string;
    category: string;
    difficulty: string;
    time_limit?: number; // Time limit in minutes
}

export default function EditQuizPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [quizData, setQuizData] = useState<QuizData>({
        title: "",
        description: "",
        category: "",
        difficulty: "Beginner",
        time_limit: 10
    });

    const [questions, setQuestions] = useState<Question[]>([]);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const res = await fetch(`/api/quizzes/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setQuizData({
                        title: data.quiz.title,
                        description: data.quiz.description,
                        category: data.quiz.category,
                        difficulty: data.quiz.difficulty,
                        time_limit: data.quiz.time_limit ? Math.floor(data.quiz.time_limit / 60) : 10 // Convert seconds to minutes
                    });
                    setQuestions(data.questions);
                } else {
                    setError("Failed to load quiz.");
                }
            } catch (err) {
                setError("Connection failed. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [id]);

    const addQuestion = () => {
        setQuestions([...questions, { question_text: "", options: ["", "", "", ""], correct_answer: 0 }]);
    };

    const removeQuestion = (index: number) => {
        if (questions.length === 1) return;
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleQuizChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
    };

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[index].question_text = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex: number, oIndex: number, value: string) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex: number, value: number) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correct_answer = value;
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            const res = await fetch(`/api/admin/quizzes/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...quizData, questions })
            });

            if (res.ok) {
                router.push("/admin/quizzes");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to update quiz.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto mb-6" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Accessing database...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 w-full">
                <div className="mb-16 flex items-center gap-6">
                    <Link href="/admin/quizzes" className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-indigo-600 transition-all">
                        <ChevronLeft className="h-6 w-6" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase">Edit <br />Quiz</h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.35em] mt-4 italic">Update quiz details</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-12">
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 p-6 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-6 w-6 flex-shrink-0" />
                            <p className="text-sm font-black uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-8">
                        <div className="flex items-center gap-4 mb-4">
                            <RefreshCw className="h-6 w-6 text-indigo-600" />
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Quiz Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Title</label>
                                <input
                                    required
                                    name="title"
                                    value={quizData.title}
                                    onChange={handleQuizChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Category</label>
                                <input
                                    required
                                    name="category"
                                    value={quizData.category}
                                    onChange={handleQuizChange}
                                    className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Description</label>
                            <textarea
                                required
                                name="description"
                                value={quizData.description}
                                onChange={handleQuizChange}
                                rows={3}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Difficulty</label>
                            <select
                                name="difficulty"
                                value={quizData.difficulty}
                                onChange={handleQuizChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all appearance-none"
                            >
                                <option value="Beginner">Level: Beginner</option>
                                <option value="Intermediate">Level: Intermediate</option>
                                <option value="Advanced">Level: Advanced</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Time Limit (minutes)
                            </label>
                            <input
                                required
                                type="number"
                                name="time_limit"
                                min="1"
                                max="180"
                                value={quizData.time_limit}
                                onChange={handleQuizChange}
                                className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all"
                            />
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] ml-2">
                                Quiz will auto-submit when time expires
                            </p>
                        </div>
                    </div>

                    {/* Questions */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-4">
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform"
                            >
                                <Plus className="h-4 w-4" /> Add Question
                            </button>
                        </div>

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-8">
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-slate-300 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 mb-10">
                                    <span className="h-10 w-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-black tabular-nums">{qIndex + 1}</span>
                                    <h3 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest italic">Question {qIndex + 1}</h3>
                                </div>

                                <div className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Question Text</label>
                                        <input
                                            required
                                            value={q.question_text}
                                            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                            className="w-full bg-slate-50 dark:bg-slate-800/50 border-2 border-transparent focus:border-indigo-600 outline-none p-5 rounded-2xl text-slate-900 dark:text-white font-bold transition-all"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {Array.isArray(q.options) && q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="space-y-3">
                                                <div className="flex items-center justify-between px-2">
                                                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Option {String.fromCharCode(65 + oIndex)}</label>
                                                    <input
                                                        type="radio"
                                                        name={`correct-${qIndex}`}
                                                        checked={q.correct_answer === oIndex}
                                                        onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                        className="w-4 h-4 accent-indigo-600 cursor-pointer"
                                                    />
                                                </div>
                                                <input
                                                    required
                                                    value={opt}
                                                    onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                    className={`w-full bg-slate-50 dark:bg-slate-800/50 border-2 outline-none p-4 rounded-xl text-sm font-bold transition-all ${q.correct_answer === oIndex ? 'border-indigo-600/50 dark:border-indigo-400/50 bg-indigo-50/50 dark:bg-indigo-500/5' : 'border-transparent focus:border-indigo-600'}`}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10">
                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-[2rem] font-black text-lg shadow-3xl hover:-translate-y-2 transition-all active:scale-95 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-4"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-6 w-6" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
