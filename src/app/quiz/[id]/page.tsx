"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { BrainCircuit, Clock, ChevronLeft, Send, Loader2 } from "lucide-react";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState<number | null>(null); // Will be set from quiz.time_limit
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
            // Set time limit from database (in seconds), default to 10 minutes if not set
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
            <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 animate-spin text-indigo-600 mx-auto" />
                    <p className="mt-6 text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Initializing Session</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-12 pb-24 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="mx-auto max-w-4xl">
                {/* Time Expired Banner */}
                {timeExpired && (
                    <div className="mb-8 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-200 dark:border-rose-500/20 p-6 rounded-3xl flex items-center gap-4 text-rose-600 dark:text-rose-400 animate-pulse">
                        <Clock className="h-8 w-8 flex-shrink-0" />
                        <div>
                            <p className="text-lg font-black uppercase tracking-tight">Time's Up!</p>
                            <p className="text-sm font-bold">Submitting your answers automatically...</p>
                        </div>
                    </div>
                )}

                {/* Header Card */}
                <div className="mb-12 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-indigo-600 rounded-xl shadow-xl shadow-indigo-100 dark:shadow-none">
                            <BrainCircuit className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-2">{quiz?.title}</h1>
                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{quiz?.category} <span className="mx-2">•</span> Module {currentQuestionIndex + 1} of {questions.length}</p>
                        </div>
                    </div>
                    <div className={`flex flex-col items-center sm:items-end px-8 py-4 rounded-[2rem] border-2 transition-all ${timeLeft < 60 ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 animate-pulse' : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50'}`}>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-1 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Remaining
                        </span>
                        <span className={`text-3xl font-black font-mono tracking-tighter ${timeLeft < 60 ? 'text-rose-600' : 'text-indigo-600 dark:text-indigo-400'}`}>
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="mb-16">
                    <div className="h-4 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800 p-1">
                        <div
                            className="h-full bg-indigo-600 rounded-full shadow-[0_0_20px_rgba(79,70,229,0.5)] transition-all duration-700 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question Terminal */}
                <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.05)] dark:shadow-none border border-slate-100 dark:border-slate-800 relative">
                    <div className="absolute top-0 right-0 p-8">
                        <span className="text-[5rem] font-black text-slate-100 dark:text-slate-800/30 select-none leading-none -mt-4 -mr-4">
                            {currentQuestionIndex + 1}
                        </span>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-12 leading-[1.2] tracking-tight max-w-2xl">
                            {currentQuestion.question_text}
                        </h2>

                        <div className="grid grid-cols-1 gap-6">
                            {currentQuestion.options.map((option: string, index: number) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswerSelect(option)}
                                    className={`w-full group flex items-center justify-between p-5 rounded-xl border-[3px] transition-all duration-300 ${answers[currentQuestion.id] === option
                                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10 shadow-xl shadow-indigo-500/10"
                                        : "border-slate-100 dark:border-slate-800/50 bg-white dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:-translate-y-1"
                                        }`}
                                >
                                    <div className="flex items-center gap-6">
                                        <div className={`h-8 w-8 rounded-lg border-2 flex items-center justify-center text-[10px] font-black transition-colors ${answers[currentQuestion.id] === option
                                            ? "bg-indigo-600 border-indigo-600 text-white"
                                            : "border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-600 group-hover:border-indigo-400"
                                            }`}>
                                            {String.fromCharCode(65 + index)}
                                        </div>
                                        <span className={`text-base transition-colors text-left ${answers[currentQuestion.id] === option ? "text-indigo-900 dark:text-indigo-400 font-black" : "text-slate-700 dark:text-slate-400 font-bold"}`}>
                                            {option}
                                        </span>
                                    </div>
                                    <div className={`h-6 w-6 rounded-full border-[3px] flex items-center justify-center transition-all ${answers[currentQuestion.id] === option ? "border-indigo-600 bg-indigo-600 scale-125" : "border-slate-200 dark:border-slate-700 opacity-20 group-hover:opacity-100"
                                        }`}>
                                        {answers[currentQuestion.id] === option && (
                                            <div className="h-2 w-2 rounded-full bg-white"></div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <button
                                disabled={currentQuestionIndex === 0}
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 disabled:opacity-0 transition-all active:scale-90"
                            >
                                <ChevronLeft className="h-4 w-4" /> Previous Module
                            </button>

                            {currentQuestionIndex === questions.length - 1 ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-none hover:bg-slate-800 dark:hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 disabled:bg-slate-400 transition-all"
                                >
                                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                    {isSubmitting ? "Finalizing..." : "Submit Decision"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                    className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-base shadow-[0_20px_40px_rgba(79,70,229,0.3)] dark:shadow-none hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 transition-all"
                                >
                                    Review Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
