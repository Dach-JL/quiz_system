import Link from "next/link";
import { BookOpen, Trophy, BarChart3, Users, CheckCircle, ArrowRight, Play, Star, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">QuizSystem</span>
            </Link>
            <div className="hidden sm:flex items-center gap-8">
              <Link href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Features</Link>
              <Link href="#how-it-works" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">How It Works</Link>
              <Link href="#testimonials" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Testimonials</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign In</Link>
              <Link href="/register" className="px-4 py-2 rounded-xl bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-500 transition-all hover:shadow-lg hover:shadow-indigo-500/25">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-32 px-6 lg:px-8 overflow-hidden">
          {/* Background Decorations */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] -z-10">
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-gradient-to-tr from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"></div>
          </div>

          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              {/* Left Content */}
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 mb-6">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Trusted by 10,000+ learners worldwide</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
                  Learn Smarter,
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Quiz Better</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Master any subject with our interactive quiz platform. Track your progress, compete with others, and achieve your learning goals faster.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
                  >
                    Start Learning Free <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
                  >
                    <Play className="h-5 w-5" /> See How It Works
                  </Link>
                </div>

                {/* Trust Indicators */}
                <div className="mt-12 flex items-center gap-6 justify-center lg:justify-start">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 border-2 border-white dark:border-slate-900 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">4.9/5 from 2,000+ reviews</p>
                  </div>
                </div>
              </div>

              {/* Right Content - Hero Visual */}
              <div className="relative hidden lg:block">
                <div className="relative">
                  {/* Main Card */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-200 dark:border-slate-700 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Quiz</p>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">JavaScript Fundamentals</h3>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold">Active</div>
                    </div>
                    <div className="space-y-4">
                      {[
                        { question: "What is a closure?", progress: 100, status: "correct" },
                        { question: "Explain event delegation", progress: 100, status: "correct" },
                        { question: "What is the 'this' keyword?", progress: 60, status: "in-progress" },
                      ].map((item, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.question}</span>
                            {item.status === "correct" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{item.progress}%</span>
                            )}
                          </div>
                          <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden">
                            <div className={`h-full rounded-full transition-all ${item.status === "correct" ? "bg-green-500 w-full" : "bg-indigo-500"}`} style={{ width: item.status === "correct" ? "100%" : `${item.progress}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Score</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">85<span className="text-sm text-slate-400">/100</span></p>
                      </div>
                      <div className="flex items-center gap-2 text-amber-500">
                        <Trophy className="h-5 w-5" />
                        <span className="text-sm font-semibold">Top 10%</span>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge 1 */}
                  <div className="absolute -top-6 -right-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4 animate-bounce">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
                        <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Streak</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">7 days</p>
                      </div>
                    </div>
                  </div>

                  {/* Floating Badge 2 */}
                  <div className="absolute -bottom-4 -left-4 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center">
                        <BarChart3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Improvement</p>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">+24%</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Powerful features designed to help you learn more effectively and track your progress every step of the way.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <BookOpen className="h-6 w-6" />,
                  title: "Interactive Quizzes",
                  description: "Engage with dynamic questions that adapt to your skill level. Get instant feedback and detailed explanations.",
                  color: "from-blue-500 to-cyan-500",
                  bg: "bg-blue-50 dark:bg-blue-500/10"
                },
                {
                  icon: <BarChart3 className="h-6 w-6" />,
                  title: "Progress Tracking",
                  description: "Visualize your learning journey with comprehensive analytics. Identify strengths and areas for improvement.",
                  color: "from-purple-500 to-pink-500",
                  bg: "bg-purple-50 dark:bg-purple-500/10"
                },
                {
                  icon: <Trophy className="h-6 w-6" />,
                  title: "Leaderboards",
                  description: "Compete with learners worldwide. Climb the ranks and earn recognition for your achievements.",
                  color: "from-amber-500 to-orange-500",
                  bg: "bg-amber-50 dark:bg-amber-500/10"
                },
                {
                  icon: <Users className="h-6 w-6" />,
                  title: "Community Learning",
                  description: "Join study groups, share knowledge, and learn together with peers from around the globe.",
                  color: "from-green-500 to-emerald-500",
                  bg: "bg-green-50 dark:bg-green-500/10"
                },
                {
                  icon: <Zap className="h-6 w-6" />,
                  title: "Instant Feedback",
                  description: "Know immediately where you stand. Our system provides real-time results and personalized recommendations.",
                  color: "from-indigo-500 to-violet-500",
                  bg: "bg-indigo-50 dark:bg-indigo-500/10"
                },
                {
                  icon: <CheckCircle className="h-6 w-6" />,
                  title: "Certification Ready",
                  description: "Earn certificates for completed courses. Showcase your achievements to employers and institutions.",
                  color: "from-rose-500 to-red-500",
                  bg: "bg-rose-50 dark:bg-rose-500/10"
                }
              ].map((feature, i) => (
                <div key={i} className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-transparent hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all hover:-translate-y-1">
                  <div className={`inline-flex p-3 rounded-xl ${feature.bg} mb-6 group-hover:scale-110 transition-transform`}>
                    <div className={`text-transparent bg-clip-text bg-gradient-to-br ${feature.color}`}>
                      <div className="h-6 w-6">{feature.icon}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                How It Works
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Get started in minutes. Our simple process helps you begin learning right away.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  step: "01",
                  title: "Create Your Account",
                  description: "Sign up for free in seconds. No credit card required. Start with our basic plan and upgrade anytime.",
                  icon: <Users className="h-6 w-6" />
                },
                {
                  step: "02",
                  title: "Choose Your Quiz",
                  description: "Browse our extensive library or create custom quizzes. Select topics that match your learning goals.",
                  icon: <BookOpen className="h-6 w-6" />
                },
                {
                  step: "03",
                  title: "Track Your Progress",
                  description: "Complete quizzes, view detailed results, and watch your skills improve over time with our analytics.",
                  icon: <BarChart3 className="h-6 w-6" />
                }
              ].map((item, i) => (
                <div key={i} className="relative">
                  {i < 2 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-indigo-200 to-transparent dark:from-indigo-800 -translate-x-8"></div>
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white mb-6 shadow-lg shadow-indigo-500/25">
                      {item.icon}
                    </div>
                    <div className="inline-block px-4 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-sm font-bold mb-4">
                      Step {item.step}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-24 px-6 lg:px-8 bg-gradient-to-br from-indigo-600 to-purple-700">
          <div className="mx-auto max-w-7xl">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { value: "10K+", label: "Active Learners" },
                { value: "500+", label: "Quiz Topics" },
                { value: "95%", label: "Success Rate" },
                { value: "24/7", label: "Support Available" }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-4xl sm:text-5xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-indigo-200 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-24 px-6 lg:px-8 bg-white dark:bg-slate-900">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Loved by Learners
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                See what our community has to say about their learning experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "Computer Science Student",
                  content: "This platform transformed how I study. The instant feedback helps me understand concepts faster, and the leaderboards keep me motivated.",
                  avatar: "SC",
                  rating: 5
                },
                {
                  name: "Marcus Johnson",
                  role: "Professional Developer",
                  content: "Perfect for skill assessment and interview prep. The detailed analytics show exactly where I need to focus my study time.",
                  avatar: "MJ",
                  rating: 5
                },
                {
                  name: "Emily Rodriguez",
                  role: "High School Teacher",
                  content: "I use this with my students for exam prep. The progress tracking helps me identify who needs extra support. Highly recommended!",
                  avatar: "ER",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <div key={i} className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

              <div className="relative">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Ready to Start Learning?
                </h2>
                <p className="text-lg text-indigo-100 mb-8 max-w-xl mx-auto">
                  Join thousands of learners already using QuizSystem to master new skills and achieve their goals.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                  <Link
                    href="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition-all hover:shadow-xl"
                  >
                    Get Started Free <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    href="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-indigo-500/20 text-white font-semibold border border-white/20 hover:bg-indigo-500/30 transition-all"
                  >
                    Sign In
                  </Link>
                </div>
                <p className="mt-6 text-sm text-indigo-200">No credit card required • Free forever plan available</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-6 lg:px-8 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">QuizSystem</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-slate-600 dark:text-slate-400">
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</Link>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-500">© 2025 QuizSystem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
