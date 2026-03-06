"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Clock, ChevronLeft, Send, Loader2, CheckCircle2 } from "lucide-react";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [timeExpired, setTimeExpired] = useState(false);

    const fetchQuizData = useCallback(async () => {
        try {
            const res = await fetch(`/api/quizzes/${quizId}`);
            if (!res.ok) throw new Error("Failed to fetch quiz");
            const data = await res.json();
            setQuiz(data.quiz);
            setQuestions(data.questions);
            setTimeLeft(data.quiz.time_limit || 600);
            setLoading(false);
        } catch (error) {
            console.error(error);
            router.push("/dashboard");
        }
    }, [quizId, router]);

    useEffect(() => {
        fetchQuizData();
    }, [fetchQuizData]);

    useEffect(() => {
        if (loading || isSubmitting || timeLeft === null || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    setTimeExpired(true);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, isSubmitting, timeLeft]);

    const handleAnswerSelect = (option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questions[currentQuestionIndex].id]: option,
        }));
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId,
                    answers,
                    timeExpired: timeExpired,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                router.push(`/results/${result.resultId}`);
            } else {
                alert("Failed to submit quiz. Please try again.");
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error("Submission error:", error);
            setIsSubmitting(false);
        }
    };

    if (loading || timeLeft === null) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-4 text-slate-600 dark:text-slate-400 font-medium">Loading quiz...</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    const getOptions = () => {
        if (!currentQuestion?.options) return [];
        if (Array.isArray(currentQuestion.options)) return currentQuestion.options;
        if (typeof currentQuestion.options === 'string') {
            try {
                return JSON.parse(currentQuestion.options);
            } catch {
                return [];
            }
        }
        return [];
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Time Expired Banner */}
                {timeExpired && (
                    <div className="mb-6 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-rose-600 dark:text-rose-400">
                        <Clock className="h-5 w-5 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Time's Up!</p>
                            <p className="text-sm">Submitting your answers...</p>
                        </div>
                    </div>
                )}

                {/* Header Card */}
                <div className="mb-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
                                <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">{quiz?.title}</h1>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${timeLeft < 60 ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'}`}>
                            <Clock className={`h-5 w-5 ${timeLeft < 60 ? 'text-rose-600' : 'text-slate-400'}`} />
                            <span className={`text-lg font-bold font-mono ${timeLeft < 60 ? 'text-rose-600' : 'text-slate-900 dark:text-white'}`}>
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-lg">
                    <div className="flex items-start justify-between mb-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed">
                            {currentQuestion.question_text}
                        </h2>
                        <span className="text-4xl font-bold text-slate-100 dark:text-slate-700 flex-shrink-0 ml-4">
                            {currentQuestionIndex + 1}
                        </span>
                    </div>

                    <div className="space-y-3">
                        {getOptions().map((option: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full group flex items-center justify-between p-4 rounded-xl border-2 transition-all ${answers[currentQuestion.id] === option
                                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                                        : "border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold transition-colors ${answers[currentQuestion.id] === option
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "border-slate-300 dark:border-slate-500 text-slate-500 dark:text-slate-400 group-hover:border-indigo-400"
                                        }`}>
                                        {String.fromCharCode(65 + index)}
                                    </div>
                                    <span className={`text-left ${answers[currentQuestion.id] === option ? "font-semibold text-indigo-900 dark:text-indigo-400" : "text-slate-700 dark:text-slate-300"
                                        }`}>
                                        {option}
                                    </span>
                                </div>
                                {answers[currentQuestion.id] === option && (
                                    <CheckCircle2 className="h-5 w-5 text-indigo-600" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4" /> Previous
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25 disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25"
                            >
                                Next Question
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
