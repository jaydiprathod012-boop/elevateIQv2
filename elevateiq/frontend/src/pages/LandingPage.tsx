import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, BrainCircuit, Target, Map, FolderKanban, CheckCircle2, Zap, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: BrainCircuit, title: 'AI Skill Analysis',      desc: 'Gemini AI deep-dives your resume to find exact skill gaps for your target role.',   color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  { icon: Target,       title: 'Skill Gap Report',       desc: 'See what\'s missing with an employability score and detailed breakdown.',            color: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30'   },
  { icon: FolderKanban, title: 'Project Generator',      desc: '6 personalized projects per analysis — Beginner to Advanced — built for your profile.', color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  { icon: Map,          title: 'Career Roadmap',         desc: 'Phase-by-phase learning plan with milestones, timelines and skill checkpoints.',    color: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/30'   },
];

const roles = ['GenAI Engineer','AI Engineer','Full Stack Developer','Data Scientist','ML Engineer','Software Engineer','Data Analyst','DevOps Engineer','Cloud Engineer'];
const stats = [{ v:'6+', l:'Projects per Analysis' },{ v:'4', l:'Roadmap Phases' },{ v:'50+', l:'Skills Tracked' },{ v:'11', l:'Career Paths' }];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 gradient-neon rounded-lg flex items-center justify-center neon-glow-purple">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg gradient-neon-text">ElevateIQ</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-white"><Link to="/login">Sign In</Link></Button>
            <Button asChild variant="gradient" size="sm"><Link to="/register">Get Started Free</Link></Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 grid-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-background to-background pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3.5 h-3.5 text-yellow-400" /> Powered by Gemini AI
            </span>
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-white">
              Build Smarter.<br /><span className="gradient-neon-text">Grow Faster.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload resume → Select target role → Get AI-powered projects, skill gaps, and career roadmap in 60 seconds.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button asChild variant="gradient" size="xl" className="neon-glow-purple"><Link to="/register">Start for Free <ArrowRight className="w-5 h-5" /></Link></Button>
              <Button asChild variant="neon" size="xl"><Link to="/login">Sign In</Link></Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-6 border-y border-purple-500/20">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <div className="text-3xl font-extrabold gradient-neon-text">{s.v}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Everything to land your dream role</h2>
            <p className="text-muted-foreground text-lg">AI tools built for students, freshers & career switchers</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                className={`p-6 rounded-2xl border ${f.border} bg-card card-glow`}>
                <div className={`w-10 h-10 ${f.bg} rounded-xl flex items-center justify-center mb-4 border ${f.border}`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-16 px-6 border-y border-purple-500/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-3">11+ Career Paths Supported</h2>
          <p className="text-muted-foreground mb-8">Pick your target role and let AI do the heavy lifting</p>
          <div className="flex flex-wrap justify-center gap-3">
            {roles.map(r => (
              <span key={r} className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 rounded-full text-sm font-medium">{r}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-8 text-center">
          {[
            { icon: Shield, title: 'Secure & Private', desc: 'Resume data encrypted, never shared.',   color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
            { icon: Zap,    title: 'Instant Analysis',  desc: 'Full AI analysis in under 60 seconds.', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
            { icon: Users,  title: 'Built for Students', desc: 'Designed for freshers & career switchers.', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
          ].map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 ${t.bg} rounded-2xl flex items-center justify-center border ${t.border}`}>
                <t.icon className={`w-6 h-6 ${t.color}`} />
              </div>
              <h3 className="font-semibold text-white">{t.title}</h3>
              <p className="text-sm text-muted-foreground">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 gradient-neon opacity-10 pointer-events-none" />
        <div className="absolute inset-0 grid-bg pointer-events-none" />
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <CheckCircle2 className="w-12 h-12 mx-auto mb-6 text-neon-green" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to elevate your career?</h2>
          <p className="text-muted-foreground mb-8 text-lg">Join thousands of students using ElevateIQ to build job-ready portfolios.</p>
          <Button asChild size="xl" variant="gradient" className="neon-glow-purple">
            <Link to="/register">Get Started — It's Free <ArrowRight className="w-5 h-5" /></Link>
          </Button>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-purple-500/20 text-center text-sm text-muted-foreground">
        <p>© 2025 <span className="gradient-neon-text font-semibold">ElevateIQ</span> — Build Smarter. Grow Faster.</p>
      </footer>
    </div>
  );
}
