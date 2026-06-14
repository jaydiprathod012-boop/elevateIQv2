import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ParsedResume {
  rawText: string;
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  certifications: string[];
  summary?: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  duration: string;
  description: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  year: string;
  gpa?: string;
}

export interface ProjectItem {
  name: string;
  description: string;
  techStack: string[];
}

export interface SkillAnalysis {
  presentSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  overallScore: number;
  strengthAreas: string[];
  improvementAreas: string[];
}

export interface GeneratedProjectData {
  title: string;
  description: string;
  techStack: string[];
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: string;
  outcomes: string[];
  resources: ResourceItem[];
  category: string;
}

export interface ResourceItem {
  title: string;
  url: string;
  type: 'video' | 'article' | 'course' | 'documentation';
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  goals: string[];
  skills: string[];
  milestones: string[];
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
