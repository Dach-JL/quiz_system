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
    time_limit?: number;
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
                        time_limit: data.quiz.time_limit ? Math.floor(data.quiz.time_limit / 60) : 10
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
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading quiz...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 pb-24 transition-colors duration-500">
            <main className="mx-auto max-w-4xl px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-10 flex items-center gap-4">
                    <Link href="/admin/quizzes" className="p-2.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Edit Quiz</h1>
                        <p className="text-slate-600 dark:text-slate-400 text-sm mt-0.5">Update quiz details and questions</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && (
                        <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-5 w-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {/* Basic Info */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/10 rounded-lg">
                                <RefreshCw className="h-5 w-5 text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quiz Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Title</label>
                                <input
                                    required
                                    name="title"
                                    value={quizData.title}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                                <input
                                    required
                                    name="category"
                                    value={quizData.category}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="mt-6">
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                            <textarea
                                required
                                name="description"
                                value={quizData.description}
                                onChange={handleQuizChange}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                                <select
                                    name="difficulty"
                                    value={quizData.difficulty}
                                    onChange={handleQuizChange}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white appearance-none"
                                >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
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
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-1">Quiz auto-submits when time expires</p>
                            </div>
                        </div>
                    </div>

                    {/* Questions */}
                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Questions</h2>
                            <button
                                type="button"
                                onClick={addQuestion}
                                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-sm hover:text-indigo-500 transition-colors"
                            >
                                <Plus className="h-4 w-4" /> Add Question
                            </button>
                        </div>

                        <div className="space-y-6">
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg relative">
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>

                                    <div className="flex items-center gap-3 mb-6">
                                        <span className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-sm">{qIndex + 1}</span>
                                        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Question {qIndex + 1}</h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Question Text</label>
                                            <input
                                                required
                                                value={q.question_text}
                                                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-600/20 dark:focus:ring-indigo-400/20 transition-all outline-none font-medium text-slate-900 dark:text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Answer Options</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {Array.isArray(q.options) && q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} className="space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">Option {String.fromCharCode(65 + oIndex)}</label>
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
                                                            className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700 border rounded-xl outline-none font-medium text-slate-900 dark:text-white transition-all ${q.correct_answer === oIndex
                                                                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 dark:border-indigo-400'
                                                                    : 'border-slate-200 dark:border-slate-600 focus:border-indigo-600 dark:focus:border-indigo-400'
                                                                }`}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 ml-1">Select the radio button to mark the correct answer</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            disabled={submitting}
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-5 w-5" />
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
