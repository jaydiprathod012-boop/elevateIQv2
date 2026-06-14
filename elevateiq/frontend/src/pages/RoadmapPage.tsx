import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map, ChevronDown, ChevronUp, CheckCircle2, Clock, Target, Loader2, BrainCircuit } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useRoadmaps } from '@/hooks/useApi';
import { formatDate } from '@/lib/utils';
import { Roadmap, RoadmapPhase } from '@/types';

const phaseColors = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-indigo-500',
  'bg-emerald-500',
];

const phaseBorders = [
  'border-blue-200',
  'border-purple-200',
  'border-indigo-200',
  'border-emerald-200',
];

const phaseTextColors = [
  'text-blue-700',
  'text-purple-700',
  'text-indigo-700',
  'text-emerald-700',
];

function PhaseCard({ phase, index }: { phase: RoadmapPhase; index: number }) {
  const [expanded, setExpanded] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border-2 ${phaseBorders[index % 4]} rounded-xl overflow-hidden`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 p-5 hover:bg-secondary/30 transition-colors text-left"
      >
        <div className={`w-10 h-10 ${phaseColors[index % 4]} rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0`}>
          {phase.phase}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold">{phase.title}</h3>
          <p className={`text-sm ${phaseTextColors[index % 4]} font-medium`}>
            <Clock className="w-3.5 h-3.5 inline mr-1" />
            {phase.duration}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant="secondary">{phase.skills?.length || 0} skills</Badge>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="px-5 pb-5 space-y-4 border-t"
        >
          <div className="grid md:grid-cols-3 gap-4 pt-4">
            {/* Goals */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Goals
              </p>
              <ul className="space-y-1.5">
                {phase.goals?.map((g, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Target className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Skills to Learn
              </p>
              <div className="flex flex-wrap gap-1.5">
                {phase.skills?.map((s, i) => (
                  <span key={i} className={`text-xs px-2.5 py-1 rounded-full bg-secondary font-medium`}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Milestones */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Milestones
              </p>
              <ul className="space-y-1.5">
                {phase.milestones?.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function RoadmapCard({ roadmap }: { roadmap: Roadmap }) {
  return (
    <div className="space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h2 className="text-xl font-bold">{roadmap.targetRole} Roadmap</h2>
          <p className="text-sm text-muted-foreground">
            Created {formatDate(roadmap.createdAt)} · {roadmap.timeline} total timeline
          </p>
        </div>
        <Badge variant="info" className="text-sm px-3 py-1">
          <Clock className="w-3.5 h-3.5 mr-1" />
          {roadmap.timeline}
        </Badge>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-3">
        {roadmap.phases?.map((phase, i) => (
          <PhaseCard key={i} phase={phase} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const { data, isLoading } = useRoadmaps();
  const [activeIndex, setActiveIndex] = useState(0);
  const roadmaps = data?.roadmaps ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Career Roadmap</h1>
        <p className="text-muted-foreground">Your AI-generated path to career success</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : roadmaps.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Map className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No roadmap generated yet</h3>
            <p className="text-muted-foreground mb-6">
              Run an AI analysis on your resume to generate a personalized career roadmap
            </p>
            <Button asChild variant="gradient">
              <Link to="/analysis">
                <BrainCircuit className="w-4 h-4" />
                Run AI Analysis
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Roadmap Switcher */}
          {roadmaps.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {roadmaps.map((r, i) => (
                <button
                  key={r.id}
                  onClick={() => setActiveIndex(i)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeIndex === i
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                >
                  {r.targetRole}
                </button>
              ))}
            </div>
          )}

          <RoadmapCard roadmap={roadmaps[activeIndex]} />
        </>
      )}
    </div>
  );
}
