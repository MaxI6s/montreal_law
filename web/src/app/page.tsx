"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Bot, Zap, Shield, Scale, Lock, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#050510] text-white flex flex-col relative overflow-hidden overflow-y-auto">
      {/* ── Animated Background Mesh ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orbs */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[150px] animate-[float_8s_ease-in-out_infinite]" />
        <div className="absolute top-[20%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/15 blur-[130px] animate-[float_10s_ease-in-out_infinite_2s]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[160px] animate-[float_12s_ease-in-out_infinite_4s]" />
        {/* Accent sparkles */}
        <div className="absolute top-[40%] left-[15%] w-[200px] h-[200px] rounded-full bg-pink-500/10 blur-[80px] animate-[float_6s_ease-in-out_infinite_1s]" />
        <div className="absolute top-[10%] right-[20%] w-[150px] h-[150px] rounded-full bg-cyan-500/10 blur-[60px] animate-[float_7s_ease-in-out_infinite_3s]" />
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* ── Hero Section ── */}
      <section className="flex-1 flex items-center justify-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto text-center space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Pill Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/10 text-indigo-300 text-sm font-medium shadow-lg shadow-indigo-500/5">
            <SparklesIcon className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Contract Negotiation</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </motion.div>
          
          {/* Headline */}
          <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05]">
            Close deals <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-[length:200%_200%] animate-[gradient-x_4s_ease_infinite] bg-gradient-to-r from-indigo-400 via-purple-400 via-pink-400 to-indigo-400">
              faster than ever.
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={itemVariants} className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
            Montreal Law resolves contract disputes instantly by analyzing <strong className="text-slate-200">both parties&apos; playbooks</strong> and proposing industry-standard compromises — in seconds, not weeks.
          </motion.p>
          
          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/workspace">
              <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all duration-300 border border-indigo-500/30">
                Launch Legal Workspace <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/sales">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 bg-white/[0.04] backdrop-blur-sm hover:bg-white/[0.08] text-slate-300 hover:-translate-y-0.5 transition-all duration-300">
                Vendor Sales Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <motion.div 
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            { value: "15s", label: "AI Mediation" },
            { value: "100%", label: "Data Privacy" },
            { value: "2×", label: "Faster Closes" },
            { value: "0", label: "Email Threads" }
          ].map((stat) => (
            <div key={stat.label} className="py-8 px-6 text-center">
              <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Feature Grid ── */}
      <section className="py-28 px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Built for the way <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">lawyers actually work</span>
            </h2>
            <p className="text-lg text-slate-500 mt-4 max-w-2xl mx-auto">
              Every feature designed to eliminate friction from contract negotiations.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FileText,
                title: "Dual-Pane Sync",
                desc: "Review clauses side-by-side with synchronized scrolling and real-time Kanban tracking. Familiar Word-style redlining, zero learning curve.",
                gradient: "from-blue-500/20 to-cyan-500/20",
                border: "border-blue-500/20 hover:border-blue-400/40",
                iconColor: "text-blue-400"
              },
              {
                icon: Bot,
                title: "AI Conciliator",
                desc: "When lawyers hit an impasse, the AI analyzes both playbooks simultaneously and proposes industry-standard compromises grounded in market practice.",
                gradient: "from-purple-500/20 to-pink-500/20",
                border: "border-purple-500/20 hover:border-purple-400/40",
                iconColor: "text-purple-400"
              },
              {
                icon: Shield,
                title: "Zero-Trust Privacy",
                desc: "Cryptographic tenant isolation ensures neither party can ever access the other's playbook. All contract text is incinerated after export.",
                gradient: "from-emerald-500/20 to-teal-500/20",
                border: "border-emerald-500/20 hover:border-emerald-400/40",
                iconColor: "text-emerald-400"
              },
              {
                icon: Scale,
                title: "Ping-Pong Negotiation",
                desc: "Built-in turn management shows exactly whose move it is. Counter-propose, accept, or escalate to AI — all from a single clause card.",
                gradient: "from-amber-500/20 to-orange-500/20",
                border: "border-amber-500/20 hover:border-amber-400/40",
                iconColor: "text-amber-400"
              },
              {
                icon: Users,
                title: "Sales Pipeline View",
                desc: "Sales reps see deal progress without accessing legal text. Get notified when clauses need commercial input, stay out of legal's way.",
                gradient: "from-rose-500/20 to-pink-500/20",
                border: "border-rose-500/20 hover:border-rose-400/40",
                iconColor: "text-rose-400"
              },
              {
                icon: Lock,
                title: "Private AI Copilot",
                desc: "Your personal AI reviews incoming contracts against your playbook, highlights violations, and drafts compliant redlines — invisible to opposing counsel.",
                gradient: "from-indigo-500/20 to-violet-500/20",
                border: "border-indigo-500/20 hover:border-indigo-400/40",
                iconColor: "text-indigo-400"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className={`group relative p-6 rounded-2xl border backdrop-blur-sm bg-gradient-to-br ${feature.gradient} ${feature.border} transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 cursor-default`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${feature.iconColor}`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative z-10 border-t border-white/5">
        <motion.div 
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight">Three Steps to Resolution</h2>
            <p className="text-slate-500 mt-3">From dispute to agreement, faster than sending an email.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Upload & Parse", desc: "Upload your .docx contract. The system automatically splits it into discrete, negotiable clauses." },
              { step: "02", title: "Negotiate & Redline", desc: "Propose edits, counter-propose, accept, or escalate. Ping-pong between parties with full track-changes." },
              { step: "03", title: "AI Conciliate", desc: "When stuck, invoke the AI Conciliator. It analyzes both playbooks and proposes a market-standard compromise." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white/20 to-transparent mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA Footer ── */}
      <section className="py-20 px-4 relative z-10 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Ready to close deals faster?</h2>
          <p className="text-slate-500 mb-8">Experience the future of contract negotiation.</p>
          <Link href="/workspace">
            <Button size="lg" className="h-14 px-10 text-lg bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/25 transition-all duration-300 border border-indigo-500/30">
              Enter the Workspace <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
