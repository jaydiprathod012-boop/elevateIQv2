import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, BrainCircuit, FolderKanban, Map, ArrowRight, TrendingUp, Target, Zap, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useDashboard } from '@/hooks/useApi';
import { useAuth } from '@/store/auth.context';
import { formatDate, getDifficultyColor } from '@/lib/utils';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const stats = data?.stats;
  const latestAnalysis = data?.latestAnalysis;
  const roadmap = data?.roadmap;

  const statCards = [
    { label: 'Career Score', value: stats?.latestScore ? `${stats.latestScore}` : '—', unit: stats?.latestScore ? '/100' : '', icon: TrendingUp, neon: 'neon-border-purple', glow: 'text-neon-purple', bg: 'bg-purple-500/10', sub: 'Employability score' },
    { label: 'Target Role',  value: stats?.targetRole || 'Not set', unit: '', icon: Target,    neon: 'neon-border-cyan',   glow: 'text-neon-cyan',   bg: 'bg-cyan-500/10',   sub: 'Current goal'       },
    { label: 'Projects',     value: String(stats?.savedProjectsCount || 0), unit: '', icon: FolderKanban, neon: 'neon-border-green', glow: 'text-neon-green', bg: 'bg-green-500/10', sub: 'Saved to portfolio' },
    { label: 'Resume',       value: stats?.resumeCount ? 'Active' : 'None', unit: '', icon: FileText, neon: 'neon-border-purple', glow: 'text-purple-400', bg: 'bg-purple-500/10', sub: stats?.resumeCount ? 'Ready for analysis' : 'Upload to start' },
  ];

  if (isLoading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-secondary rounded w-1/3" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <div key={i} className="h-28 bg-secondary rounded-xl" />)}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-white">
          {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},{' '}
          <span className="gradient-neon-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {latestAnalysis ? `Targeting ${latestAnalysis.targetRole} — keep building!` : 'Upload your resume to start your AI career journey.'}
        </p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className={`${card.neon} bg-card`}>
                <CardContent className="p-5">
                  <div className={`${card.bg} w-9 h-9 rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-4 h-4 ${card.glow}`} />
                  </div>
                  <p className={`text-2xl font-bold ${card.glow}`}>{card.value}<span className="text-sm text-muted-foreground ml-0.5">{card.unit}</span></p>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.sub}</p>
                  <p className="text-xs font-medium text-gray-400 mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="neon-border-purple lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2 text-white">
              <Zap className="w-4 h-4 text-yellow-400" /> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {[
              { label: 'Upload Resume',   href: '/resume',   icon: Upload,       color: 'text-cyan-400',   desc: 'Add your latest resume'    },
              { label: 'Run AI Analysis', href: '/analysis', icon: BrainCircuit, color: 'text-purple-400', desc: 'Analyze skills & gaps'      },
              { label: 'Browse Projects', href: '/projects', icon: FolderKanban, color: 'text-green-400',  desc: 'View recommendations'      },
              { label: 'View Roadmap',    href: '/roadmap',  icon: Map,          color: 'text-yellow-400', desc: 'Your career path'          },
            ].map((a) => {
              const Icon = a.icon;
              return (
                <Link key={a.href} to={a.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/80 transition-colors group border border-transparent hover:border-purple-500/20">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
                    <Icon className={`w-4 h-4 ${a.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-purple-400 transition-colors" />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        {/* Latest Analysis */}
        <div className="lg:col-span-2">
          {latestAnalysis ? (
            <Card className="neon-border-purple h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2 text-white">
                    <BrainCircuit className="w-4 h-4 text-neon-purple" /> Latest Analysis
                  </CardTitle>
                  <Link to="/analysis"><Button variant="ghost" size="sm" className="text-xs h-7 text-purple-400">View all <ArrowRight className="w-3 h-3" /></Button></Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-neon-purple">{latestAnalysis.overallScore}</p>
                    <p className="text-xs text-muted-foreground">/ 100</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-medium text-gray-200">Employability Score</p>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">{latestAnalysis.targetRole}</Badge>
                    </div>
                    <Progress value={latestAnalysis.overallScore} className="h-2 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-cyan-500" />
                    <p className="text-xs text-muted-foreground mt-1">{formatDate(latestAnalysis.createdAt)}</p>
                  </div>
                </div>
                {latestAnalysis.skillGaps && (latestAnalysis.skillGaps as string[]).length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-gray-300">Skills to Build</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(latestAnalysis.skillGaps as string[]).slice(0, 6).map((s) => (
                        <span key={s} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {latestAnalysis.projects && latestAnalysis.projects.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2 text-gray-300">Recommended Projects</p>
                    <div className="space-y-2">
                      {latestAnalysis.projects.slice(0, 3).map((p) => (
                        <div key={p.id} className="flex items-center gap-3 p-2.5 bg-secondary/50 rounded-lg border border-border">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-gray-200">{p.title}</p>
                            <p className="text-xs text-muted-foreground">{p.duration}</p>
                          </div>
                          <Badge className={getDifficultyColor(p.difficulty)}>{p.difficulty}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex flex-col items-center justify-center p-12 text-center neon-border-purple border-dashed">
              <div className="w-16 h-16 gradient-neon rounded-2xl flex items-center justify-center mb-4 neon-glow-purple">
                <BrainCircuit className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-white">No analysis yet</h3>
              <p className="text-muted-foreground text-sm mb-6 max-w-xs">Upload your resume and run an AI analysis to get personalized project recommendations.</p>
              <Button asChild variant="gradient"><Link to="/resume">Get Started <ArrowRight className="w-4 h-4" /></Link></Button>
            </Card>
          )}
        </div>
      </div>

      {roadmap && (
        <Card className="neon-border-cyan">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2 text-white">
                <Map className="w-4 h-4 text-neon-cyan" /> Career Roadmap — {roadmap.targetRole}
              </CardTitle>
              <Link to="/roadmap"><Button variant="ghost" size="sm" className="text-xs h-7 text-cyan-400">Full roadmap <ArrowRight className="w-3 h-3" /></Button></Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(roadmap.phases as { phase: number; title: string; duration: string; goals: string[] }[]).slice(0, 4).map((phase, idx) => (
                <div key={phase.phase} className={`p-3 rounded-xl border ${idx === 0 ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-border bg-secondary/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${idx === 0 ? 'bg-cyan-500 text-white' : 'bg-secondary text-muted-foreground'}`}>{phase.phase}</div>
                    <span className="text-xs text-muted-foreground">{phase.duration}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-200 mb-1">{phase.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">{phase.goals?.[0]}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
