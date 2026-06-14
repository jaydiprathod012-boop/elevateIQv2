import { useState, type ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderKanban, ExternalLink, Bookmark, CheckCircle2,
  XCircle, PlayCircle, Filter, Loader2, ChevronDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSavedProjects, useUpdateProjectStatus, useAnalyses } from '@/hooks/useApi';
import { formatDate, getDifficultyColor, getStatusColor } from '@/lib/utils';
import { SavedProject, Analysis, Project } from '@/types';
import { useSaveProject } from '@/hooks/useApi';

const statusIcons: Record<string, ReactElement> = {
  SAVED: <Bookmark className="w-3.5 h-3.5" />,
  IN_PROGRESS: <PlayCircle className="w-3.5 h-3.5" />,
  COMPLETED: <CheckCircle2 className="w-3.5 h-3.5" />,
  DROPPED: <XCircle className="w-3.5 h-3.5" />,
};

function ProjectCard({ sp, onStatusChange }: {
  sp: SavedProject;
  onStatusChange: (id: string, status: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const p = sp.project;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base leading-snug">{p.title}</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{p.category} · {p.duration}</p>
            </div>
            <Badge className={getDifficultyColor(p.difficulty)}>{p.difficulty}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {p.techStack.slice(0, 5).map(t => (
              <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-full">{t}</span>
            ))}
            {p.techStack.length > 5 && (
              <span className="text-xs text-muted-foreground px-2 py-0.5">+{p.techStack.length - 5}</span>
            )}
          </div>

          {/* Status selector */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-full font-medium ${getStatusColor(sp.status)} transition-colors`}
            >
              {statusIcons[sp.status]}
              {sp.status.replace('_', ' ')}
              <ChevronDown className="w-3 h-3 ml-1" />
            </button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute left-0 top-full mt-1 z-10 bg-white border rounded-lg shadow-lg overflow-hidden min-w-36"
                >
                  {['SAVED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED'].map(s => (
                    <button
                      key={s}
                      onClick={() => { onStatusChange(sp.id, s); setOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-xs hover:bg-accent transition-colors"
                    >
                      {statusIcons[s]}
                      {s.replace('_', ' ')}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Resources */}
          {p.resources?.length > 0 && (
            <div className="border-t pt-3 space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Resources</p>
              {p.resources.slice(0, 2).map((r, i) => (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {r.title}
                </a>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground">Saved {formatDate(sp.savedAt)}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SuggestedProjects() {
  const { data: analysisData } = useAnalyses();
  const saveProject = useSaveProject();
  const latestAnalysis = analysisData?.analyses?.[0] as Analysis | undefined;
  const projects = latestAnalysis?.projects ?? [];

  if (!projects.length) return null;

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">AI-Generated Projects</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p: Project) => (
          <Card key={p.id} className="hover:shadow-md transition-shadow border-dashed border-2 border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{p.title}</CardTitle>
                <Badge className={getDifficultyColor(p.difficulty)}>{p.difficulty}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{p.category} · {p.duration}</p>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>
              <div className="flex flex-wrap gap-1">
                {p.techStack.slice(0, 4).map(t => (
                  <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => saveProject.mutate(p.id)}
                disabled={saveProject.isPending}
              >
                <Bookmark className="w-3.5 h-3.5" />
                Save Project
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { data, isLoading } = useSavedProjects();
  const updateStatus = useUpdateProjectStatus();
  const [filter, setFilter] = useState<string>('ALL');

  const projects = data?.projects ?? [];
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.status === filter);

  const handleStatusChange = (id: string, status: string) => {
    updateStatus.mutate({ id, status });
  };

  const counts = {
    ALL: projects.length,
    SAVED: projects.filter(p => p.status === 'SAVED').length,
    IN_PROGRESS: projects.filter(p => p.status === 'IN_PROGRESS').length,
    COMPLETED: projects.filter(p => p.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-muted-foreground">Track your portfolio projects and progress</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-muted-foreground" />
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {key.replace('_', ' ')}
            <span className="bg-white/20 rounded-full px-1.5 text-xs">{count}</span>
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-secondary/30 rounded-2xl border border-dashed">
          <FolderKanban className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium">No projects yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Run an AI analysis to get personalized project recommendations
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(sp => (
            <ProjectCard key={sp.id} sp={sp} onStatusChange={handleStatusChange} />
          ))}
        </div>
      )}

      {/* Suggested from latest analysis */}
      <SuggestedProjects />
    </div>
  );
}
