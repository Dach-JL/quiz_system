"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Loader2, ArrowRight, BrainCircuit } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                router.push("/dashboard");
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || "Registration failed.");
            }
        } catch (err) {
            setError("Central Link failure. Registry unreachable.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 transition-colors duration-500">
            <div className="w-full max-w-lg">
                <div className="text-center mb-16">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-2xl text-white shadow-2xl mb-10">
                        <BrainCircuit className="h-8 w-8" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-none mb-4">Register <br />Identity.</h1>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest italic leading-none underline decoration-indigo-500/20 underline-offset-8">Create your global knowledge node</p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.06)] dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="p-5 bg-rose-50 dark:bg-rose-500/10 border-2 border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-black italic text-center">
                                Protocol Error: {error}
                            </div>
                        )}

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Node Name</label>
                            <div className="relative group">
                                <User className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-500 transition-all outline-none font-bold text-slate-900 dark:text-white uppercase tracking-tight"
                                    placeholder="Enter Persona"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Registry Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-500 transition-all outline-none font-bold text-slate-900 dark:text-white"
                                    placeholder="node@nexus.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">Security Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 dark:text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-16 pr-8 py-5 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-800 rounded-2xl focus:border-indigo-600 dark:focus:border-indigo-500 transition-all outline-none font-bold text-slate-900 dark:text-white"
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
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <UserPlus className="h-5 w-5" />}
                            {loading ? "Registering..." : "Sync Identity"}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500 italic">
                            Existing Node? <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-black not-italic ml-2">Login to Terminal <ArrowRight className="inline h-3 w-3 ml-1" /></Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
