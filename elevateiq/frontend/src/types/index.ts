export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface Resume {
  id: string;
  fileName: string;
  uploadedAt: string;
  isActive: boolean;
  parsedData?: {
    skills?: string[];
    experience?: object[];
    education?: object[];
    projects?: object[];
  };
}

export interface Analysis {
  id: string;
  targetRole: string;
  overallScore: number;
  skills: string[];
  skillGaps: string[];
  strengths: string[];
  suggestions: string[];
  createdAt: string;
  resume?: { fileName: string };
  projects?: Project[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  outcomes: string[];
  resources: Resource[];
  category: string;
  createdAt: string;
}

export interface Resource {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
}

export interface SavedProject {
  id: string;
  status: 'SAVED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';
  notes?: string;
  savedAt: string;
  project: Project;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  goals: string[];
  skills: string[];
  milestones: string[];
}

export interface Roadmap {
  id: string;
  targetRole: string;
  timeline: string;
  phases: RoadmapPhase[];
  createdAt: string;
}

export interface DashboardData {
  user: User;
  stats: {
    resumeCount: number;
    savedProjectsCount: number;
    latestScore: number;
    targetRole: string | null;
  };
  latestAnalysis: Analysis | null;
  projectStats: { status: string; _count: { status: number } }[];
  roadmap: Roadmap | null;
}

export const TARGET_ROLES = [
  'GenAI Engineer',
  'AI Engineer',
  'Full Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'ML Engineer',
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'DevOps Engineer',
  'Cloud Engineer',
] as const;

export type TargetRole = typeof TARGET_ROLES[number];
