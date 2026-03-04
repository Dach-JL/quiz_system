"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";

export default function QuizPage() {
    const params = useParams();
    const router = useRouter();
    const quizId = params.id;

    const [quiz, setQuiz] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes default
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchQuizData = useCallback(async () => {
        try {
            const res = await fetch(`/api/quizzes/${quizId}`);
            if (!res.ok) throw new Error("Failed to fetch quiz");
            const data = await res.json();
            setQuiz(data.quiz);
            setQuestions(data.questions);
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
        if (loading || isSubmitting) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [loading, isSubmitting]);

    const handleAnswerSelect = (option: string) => {
        setAnswers((prev) => ({
            ...prev,
            [questions[currentQuestionIndex].id]: option,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("/api/quiz/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizId,
                    answers,
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

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading quiz...</p>
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
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{quiz?.title}</h1>
                        <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {questions.length}</p>
                    </div>
                    <div className={`flex flex-col items-end ${timeLeft < 60 ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`}>
                        <span className="text-xs font-bold uppercase tracking-wider">Time Left</span>
                        <span className="text-2xl font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>

                {/* Question Card */}
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                    <h2 className="text-xl font-semibold text-gray-900 mb-8">
                        {currentQuestion.question_text}
                    </h2>

                    <div className="space-y-4">
                        {currentQuestion.options.map((option: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${answers[currentQuestion.id] === option
                                        ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                                        : "border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-white"
                                    }`}
                            >
                                <span className={`text-lg ${answers[currentQuestion.id] === option ? "text-indigo-900 font-bold" : "text-gray-700 font-medium"}`}>
                                    {option}
                                </span>
                                <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${answers[currentQuestion.id] === option ? "border-indigo-600 bg-indigo-600" : "border-gray-300"
                                    }`}>
                                    {answers[currentQuestion.id] === option && (
                                        <div className="h-2 w-2 rounded-full bg-white"></div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="mt-12 flex items-center justify-between">
                        <button
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                            className="px-6 py-3 text-sm font-bold text-gray-600 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-600 transition-colors"
                        >
                            ← Previous
                        </button>

                        {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 disabled:bg-gray-400 transition-all"
                            >
                                {isSubmitting ? "Submitting..." : "Submit Quiz"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                                className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-500 transition-all"
                            >
                                Next Question →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
