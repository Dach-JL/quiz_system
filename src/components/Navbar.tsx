"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, BookOpen, ShieldAlert } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "same-origin",
            });

            setUser(null);
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error("Logout failed:", error);
            setUser(null);
            router.push("/login");
        }
    };

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch("/api/auth/session");
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (error) {
                setUser(null);
            }
        };
        fetchSession();
    }, [pathname]);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                            <BookOpen className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-slate-900 dark:text-white">QuizSystem</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {user && pathname !== '/' && (
                            <>
                                <Link href="/dashboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
                                <Link href="/leaderboard" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Leaderboard</Link>
                                {user.role === 'admin' && (
                                    <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-colors">
                                        <ShieldAlert className="h-4 w-4" /> Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <ThemeToggle />
                        {!user ? (
                            <>
                                <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</Link>
                                <Link href="/register" className="px-4 py-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25">Get Started</Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{user.name}</span>
                                <button onClick={handleLogout} className="text-sm font-semibold text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center gap-2">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 py-6 space-y-4">
                    {user && pathname !== '/' && (
                        <>
                            <Link href="/dashboard" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Dashboard</Link>
                            <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="block text-base font-medium text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Leaderboard</Link>
                            {user.role === 'admin' && (
                                <Link href="/admin/dashboard" onClick={() => setIsOpen(false)} className="block text-base font-medium text-rose-600 dark:text-rose-400 hover:text-rose-500 transition-colors">Admin Panel</Link>
                            )}
                            <div className="h-px bg-slate-200 dark:bg-slate-800" />
                        </>
                    )}
                    {!user ? (
                        <>
                            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-base font-semibold text-slate-900 dark:text-white hover:text-indigo-600 transition-colors">Sign In</Link>
                            <Link href="/register" onClick={() => setIsOpen(false)} className="block w-full py-3 bg-indigo-600 text-white rounded-xl text-center font-semibold hover:bg-indigo-500 transition-all">Get Started</Link>
                        </>
                    ) : (
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Logged in as</p>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
                            </div>
                            <button onClick={() => { setIsOpen(false); handleLogout(); }} className="block w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl text-center font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                                Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
