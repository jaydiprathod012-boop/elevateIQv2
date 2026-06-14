import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Loader2, ChevronRight, CheckCircle2, XCircle, AlertCircle, Lightbulb, Download, Bookmark } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useResumes, useAnalyses, useAnalyzeResume, useSaveProject } from '@/hooks/useApi';
import { TARGET_ROLES, Analysis } from '@/types';
import { formatDate } from '@/lib/utils';

function generatePDFReport(analysis: Analysis) {
  const skills = analysis.skills as string[];
  const gaps   = analysis.skillGaps as string[];
  const tips   = analysis.suggestions as string[];
  const score  = analysis.overallScore;

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>ElevateIQ Career Report — ${analysis.targetRole}</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;background:#0f0f1a;color:#e2e8f0;padding:40px}
  .header{background:linear-gradient(135deg,#7c3aed,#22d3ee);padding:32px;border-radius:16px;margin-bottom:28px;text-align:center}
  .header h1{font-size:2rem;font-weight:800;color:#fff;margin-bottom:4px}
  .header p{color:rgba(255,255,255,0.8);font-size:0.95rem}
  .score-box{background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.4);border-radius:12px;padding:24px;margin-bottom:24px;display:flex;align-items:center;gap:24px}
  .score-num{font-size:4rem;font-weight:900;color:#a855f7;min-width:100px;text-align:center}
  .score-bar{flex:1;height:12px;background:#1e1e2e;border-radius:6px;overflow:hidden}
  .score-fill{height:100%;background:linear-gradient(90deg,#7c3aed,#22d3ee);border-radius:6px}
  .section{background:#12121f;border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:20px}
  .section h2{font-size:1rem;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
  .tag{display:inline-block;padding:4px 12px;border-radius:20px;font-size:0.75rem;font-weight:600;margin:3px}
  .tag-green{background:rgba(74,222,128,0.15);color:#4ade80;border:1px solid rgba(74,222,128,0.3)}
  .tag-yellow{background:rgba(251,191,36,0.15);color:#fbbf24;border:1px solid rgba(251,191,36,0.3)}
  .tag-purple{background:rgba(168,85,247,0.15);color:#c084fc;border:1px solid rgba(168,85,247,0.3)}
  .tip{display:flex;gap:10px;margin-bottom:10px;align-items:flex-start}
  .tip-num{background:rgba(168,85,247,0.2);color:#a855f7;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700;flex-shrink:0;margin-top:2px}
  .project{background:#0d0d1a;border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:14px;margin-bottom:12px}
  .project h3{font-size:0.9rem;font-weight:700;margin-bottom:6px;color:#e2e8f0}
  .project p{font-size:0.8rem;color:#94a3b8;margin-bottom:8px;line-height:1.5}
  .diff{display:inline-block;padding:2px 10px;border-radius:20px;font-size:0.7rem;font-weight:700}
  .diff-B{background:rgba(74,222,128,0.15);color:#4ade80}
  .diff-I{background:rgba(34,211,238,0.15);color:#22d3ee}
  .diff-A{background:rgba(168,85,247,0.15);color:#a855f7}
  .footer{text-align:center;margin-top:32px;color:#475569;font-size:0.8rem;padding-top:20px;border-top:1px solid rgba(255,255,255,0.06)}
</style>
</head>
<body>
<div class="header">
  <h1>⚡ ElevateIQ Career Report</h1>
  <p>AI-Powered Analysis for <strong>${analysis.targetRole}</strong> · ${formatDate(analysis.createdAt || new Date().toISOString())}</p>
</div>

<div class="score-box">
  <div>
    <div class="score-num">${score}</div>
    <div style="text-align:center;font-size:0.75rem;color:#94a3b8">Employability Score</div>
  </div>
  <div style="flex:1">
    <p style="font-size:1rem;font-weight:700;margin-bottom:8px;color:#e2e8f0">Readiness for ${analysis.targetRole}</p>
    <div class="score-bar"><div class="score-fill" style="width:${score}%"></div></div>
    <p style="font-size:0.8rem;color:#94a3b8;margin-top:6px">${score>=75?'Excellent — ready to apply with a few more projects!':score>=50?'Good foundation — bridge key skill gaps to stand out.':'Early stage — follow the roadmap to level up quickly.'}</p>
  </div>
</div>

<div class="section">
  <h2>✅ Present Skills (${skills.length})</h2>
  <div>${skills.map(s=>`<span class="tag tag-green">${s}</span>`).join('')}</div>
</div>

<div class="section">
  <h2>⚡ Skills to Build (${gaps.length})</h2>
  <div>${gaps.map(s=>`<span class="tag tag-yellow">${s}</span>`).join('')}</div>
</div>

${tips.length > 0 ? `<div class="section">
  <h2>💡 Resume Improvement Tips</h2>
  ${tips.map((t,i)=>`<div class="tip"><div class="tip-num">${i+1}</div><p style="font-size:0.85rem;color:#cbd5e1;line-height:1.6">${t}</p></div>`).join('')}
</div>` : ''}

${analysis.projects && analysis.projects.length > 0 ? `<div class="section">
  <h2>🚀 Recommended Projects (${analysis.projects.length})</h2>
  ${analysis.projects.map(p=>`<div class="project">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
      <h3>${p.title}</h3>
      <span class="diff diff-${p.difficulty[0]}">${p.difficulty}</span>
    </div>
    <p>${p.description}</p>
    <div>${(p.techStack as string[]).map(t=>`<span class="tag tag-purple">${t}</span>`).join('')}</div>
    <p style="font-size:0.75rem;color:#64748b;margin-top:6px">⏱ ${p.duration}</p>
  </div>`).join('')}
</div>` : ''}

<div class="footer">
  <p>Generated by <strong>ElevateIQ</strong> — Build Smarter. Grow Faster. | elevateiq.app</p>
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `ElevateIQ_Report_${analysis.targetRole.replace(/\s+/g,'_')}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AnalysisPage() {
  const { data: resumeData }    = useResumes();
  const { data: analysisData, isLoading: loadingAnalyses } = useAnalyses();
  const analyzeMutation = useAnalyzeResume();
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

  const activeResume = resumeData?.resumes?.find(r => r.isActive);
  const analyses     = analysisData?.analyses || [];

  const handleAnalyze = async () => {
    if (!activeResume || !selectedRole) return;
    try {
      const result = await analyzeMutation.mutateAsync({ resumeId: activeResume.id, targetRole: selectedRole });
      setSelectedAnalysis(result.analysis);
    } catch { /* shown via mutation state */ }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Career Analysis</h1>
        <p className="text-muted-foreground text-sm mt-1">Get personalized skill gap analysis, projects & roadmap</p>
      </div>

      <Card className="neon-border-purple">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2 text-white">
            <BrainCircuit className="w-4 h-4 text-neon-purple" /> Start New Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {!activeResume ? (
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm text-yellow-400">
              <AlertCircle className="w-5 h-5 shrink-0" /> Please upload a resume first.
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-sm text-green-400">
              <CheckCircle2 className="w-4 h-4 shrink-0" /> Resume: <span className="font-medium ml-1">{activeResume.fileName}</span>
            </div>
          )}

          <div>
            <p className="text-sm font-medium mb-3 text-gray-300">Select Target Role</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {TARGET_ROLES.map((role) => (
                <button key={role} onClick={() => setSelectedRole(role)}
                  className={`text-left px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    selectedRole === role
                      ? 'border-purple-500/60 bg-purple-500/15 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                      : 'border-border text-gray-400 hover:border-purple-500/40 hover:bg-purple-500/5 hover:text-gray-200'
                  }`}>{role}</button>
              ))}
            </div>
          </div>

          <Button onClick={handleAnalyze} disabled={!activeResume || !selectedRole || analyzeMutation.isPending} variant="gradient" size="lg" className="w-full sm:w-auto">
            {analyzeMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing... (30-60s)</> : <><BrainCircuit className="w-4 h-4" /> Run AI Analysis</>}
          </Button>

          {analyzeMutation.isPending && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl text-sm text-purple-300 space-y-1.5">
              {['🔍 Analyzing skills & experience...','📊 Identifying skill gaps...','💡 Generating project ideas...','🗺️ Building career roadmap...'].map((t,i)=>(
                <motion.p key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}} transition={{delay:i*0.4}}>{t}</motion.p>
              ))}
            </div>
          )}

          {analyzeMutation.isError && (
            <div className="flex items-center gap-2 text-red-400 text-sm p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <XCircle className="w-4 h-4 shrink-0" /> AI analysis failed. Check your Gemini API key in backend .env
            </div>
          )}
        </CardContent>
      </Card>

      <AnimatePresence>
        {selectedAnalysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <AnalysisResult analysis={selectedAnalysis} />
          </motion.div>
        )}
      </AnimatePresence>

      {!loadingAnalyses && analyses.length > 0 && !selectedAnalysis && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Analysis History</h2>
          <div className="space-y-3">
            {analyses.map((a) => (
              <Card key={a.id} className="cursor-pointer hover:neon-border-purple transition-all" onClick={() => setSelectedAnalysis(a)}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[52px]">
                      <p className="text-2xl font-bold text-neon-purple">{a.overallScore}</p>
                      <p className="text-xs text-muted-foreground">score</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <p className="text-sm font-semibold text-gray-200">{a.targetRole}</p>
                        <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">{a.resume?.fileName}</Badge>
                      </div>
                      <Progress value={a.overallScore} className="h-1.5 bg-secondary [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-cyan-500" />
                      <p className="text-xs text-muted-foreground mt-1">{formatDate(a.createdAt)}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: Analysis }) {
  const skills = analysis.skills as string[];
  const gaps   = analysis.skillGaps as string[];
  const tips   = analysis.suggestions as string[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold text-white">Results — {analysis.targetRole}</h2>
        <Button variant="neon" size="sm" onClick={() => generatePDFReport(analysis)}>
          <Download className="w-4 h-4" /> Download Report
        </Button>
      </div>

      {/* Score */}
      <Card className="neon-border-purple bg-gradient-to-br from-purple-500/10 to-cyan-500/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-6xl font-black text-neon-purple">{analysis.overallScore}</p>
              <p className="text-sm text-muted-foreground font-medium">/ 100</p>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-200 mb-2">Employability Score</p>
              <Progress value={analysis.overallScore} className="h-3 mb-2 bg-secondary/80 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-cyan-400" />
              <p className="text-xs text-muted-foreground">
                {analysis.overallScore >= 75 ? '🔥 Great match! Build a few more projects to stand out.' :
                 analysis.overallScore >= 50 ? '⚡ Good foundation. Bridge key skill gaps.' :
                 '🚀 Early stage. Follow the roadmap to level up.'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-5">
        <Card className="neon-border-green">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <CheckCircle2 className="w-4 h-4 text-neon-green" /> Present Skills ({skills.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {skills.map(s => <span key={s} className="text-xs bg-green-500/10 text-green-400 border border-green-500/30 px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <XCircle className="w-4 h-4 text-yellow-400" /> Skills to Build ({gaps.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {gaps.map(s => <span key={s} className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 px-2.5 py-1 rounded-full">{s}</span>)}
            </div>
          </CardContent>
        </Card>
      </div>

      {tips.length > 0 && (
        <Card className="neon-border-cyan">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <Lightbulb className="w-4 h-4 text-neon-cyan" /> Resume Improvement Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2.5">
              {tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold border border-cyan-500/30">{i + 1}</span>
                  <span className="text-gray-300">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {analysis.projects && analysis.projects.length > 0 && (
        <div>
          <h3 className="text-base font-semibold text-white mb-3">🚀 Generated Projects ({analysis.projects.length})</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {analysis.projects.map((p) => <ProjectCard key={p.id} project={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }: { project: Analysis['projects'] extends (infer T)[] | undefined ? NonNullable<T> : never }) {
  const saveMutation = useSaveProject();
  const [saved, setSaved] = useState(false);

  const diffColors: Record<string, string> = {
    BEGINNER:     'bg-green-500/15 text-green-400 border border-green-500/30',
    INTERMEDIATE: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
    ADVANCED:     'bg-purple-500/15 text-purple-400 border border-purple-500/30',
  };

  const handleSave = async () => {
    try { await saveMutation.mutateAsync(project.id); setSaved(true); }
    catch { setSaved(true); }
  };

  return (
    <Card className="hover:neon-border-purple transition-all">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-200 leading-snug">{project.title}</h4>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${diffColors[project.difficulty]}`}>{project.difficulty}</span>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {(project.techStack as string[]).slice(0, 4).map(t => (
            <span key={t} className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-mono">{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">⏱ {project.duration}</span>
          <Button size="sm" variant={saved ? 'secondary' : 'neon'} className="h-7 text-xs" onClick={handleSave} disabled={saved || saveMutation.isPending}>
            {saved ? <><CheckCircle2 className="w-3 h-3" /> Saved</> : <><Bookmark className="w-3 h-3" /> Save</>}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
