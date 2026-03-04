"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2, ArrowRight, BrainCircuit } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Authentication failed.");
            }
        } catch (err) {
            setError("Protocol failure. Check network uplink.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 transition-colors duration-500">
            <div className="w-full max-w-md">
                <div className="text-center mb-10 animate-fade-in">
                    <div className="inline-flex p-3 bg-indigo-600 rounded-xl text-white shadow-2xl mb-8">
                        <BrainCircuit className="h-6 w-6" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-3">Welcome <br />Back.</h1>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest italic leading-none underline decoration-indigo-500/20 underline-offset-4">Access your personalized learning terminal</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl shadow-[0_40px_100px_rgba(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-5 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-black italic text-center">
                                Error: {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Uplink Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 transition-all outline-none font-bold text-slate-900 dark:text-white text-sm"
                                    placeholder="node@nexus.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-indigo-600 dark:focus:border-indigo-500 transition-all outline-none font-bold text-slate-900 dark:text-white text-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white py-3.5 rounded-2xl font-black text-sm shadow-2xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-500 hover:-translate-y-1 active:scale-95 disabled:bg-slate-400 transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                            {loading ? "Decrypting..." : "Initialize Session"}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 italic">
                            New Node? <Link href="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-black not-italic ml-2">Register Identity <ArrowRight className="inline h-3 w-3 ml-1" /></Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
