"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, BrainCircuit, ShieldAlert } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                console.error("Failed to fetch session", error);
            }
        };
        fetchSession();
    }, []);

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-lg group-hover:scale-110 transition-transform">
                                <BrainCircuit className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                Quiz<span className="text-indigo-600">Master</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/dashboard" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">Dashboard</Link>
                            <Link href="/leaderboard" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 transition-colors">Leaderboard</Link>
                            {user?.role === 'admin' && (
                                <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm font-black text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-colors">
                                    <ShieldAlert className="h-4 w-4" /> Admin Panel
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {!user ? (
                            <>
                                <Link href="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 px-3 py-2 transition-colors">Sign In</Link>
                                <Link href="/register" className="text-sm font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-500 shadow-lg shadow-indigo-100 dark:shadow-none transition-all active:scale-95">Get Started</Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-bold text-slate-500 italic">Logged in as {user.name}</span>
                                <Link href="/api/auth/logout" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">Sign Out</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-slate-900 px-4 py-6 space-y-4">
                    <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white">Dashboard</Link>
                    <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white">Leaderboard</Link>
                    <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />
                    <Link href="/login" onClick={() => setIsOpen(false)} className="block text-lg font-bold text-gray-900 dark:text-white">Sign In</Link>
                    <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full py-4 bg-indigo-600 text-white rounded-2xl text-center font-black shadow-xl shadow-indigo-100 dark:shadow-none">Get Started</Link>
                </div>
            )}
        </nav>
    );
}
