import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import prisma from '../config/prisma';
import { geminiService } from '../services/gemini.service';

const analyzeSchema = z.object({
  resumeId: z.string().min(1),
  targetRole: z.string().min(1),
});

export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = analyzeSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { resumeId, targetRole } = validation.data;

    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: req.user!.id },
    });

    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const parsedData = resume.parsedData as { skills?: string[]; experience?: object[]; education?: object[]; projects?: object[] };
    const resumeData = {
      rawText: resume.parsedText,
      skills: parsedData.skills || [],
      experience: (parsedData.experience || []) as { title: string; company: string; duration: string; description: string[] }[],
      education: (parsedData.education || []) as { degree: string; institution: string; year: string }[],
      projects: (parsedData.projects || []) as { name: string; description: string; techStack: string[] }[],
      certifications: [],
    };

    const skillAnalysis = await geminiService.analyzeSkillGaps(resumeData, targetRole);
    const [projects, roadmap, improvements] = await Promise.all([
      geminiService.generateProjects(resumeData, targetRole, skillAnalysis),
      geminiService.generateRoadmap(targetRole, resumeData.skills),
      geminiService.generateResumeImprovements(resumeData, targetRole),
    ]);

    const analysis = await prisma.analysis.create({
      data: {
        userId: req.user!.id,
        resumeId,
        targetRole,
        skills: skillAnalysis.presentSkills,
        skillGaps: skillAnalysis.missingSkills,
        strengths: skillAnalysis.strengthAreas,
        suggestions: improvements,
        overallScore: skillAnalysis.overallScore,
      },
    });

    const savedProjects = await Promise.all(
      projects.map(p =>
        prisma.generatedProject.create({
          data: {
            analysisId: analysis.id,
            title: p.title,
            description: p.description,
            techStack: p.techStack,
            difficulty: p.difficulty,
            duration: p.duration,
            outcomes: p.outcomes,
            resources: p.resources as object[],
            category: p.category,
          },
        })
      )
    );

    await prisma.roadmap.create({
      data: {
        userId: req.user!.id,
        targetRole,
        phases: roadmap.phases as object[],
        timeline: roadmap.timeline,
      },
    });

    res.status(201).json({
      message: 'Analysis complete',
      analysis: {
        id: analysis.id,
        targetRole,
        overallScore: skillAnalysis.overallScore,
        skillAnalysis,
        improvements,
        projects: savedProjects,
        roadmap,
      },
    });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'AI analysis failed. Please try again.' });
  }
};

export const getAnalyses = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const analyses = await prisma.analysis.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
      include: {
        resume: { select: { fileName: true } },
        projects: { take: 3 },
      },
    });
    res.json({ analyses });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
};

export const getAnalysisById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const analysis = await prisma.analysis.findFirst({
      where: { id, userId: req.user!.id },
      include: {
        resume: { select: { fileName: true } },
        projects: true,
      },
    });

    if (!analysis) {
      res.status(404).json({ error: 'Analysis not found' });
      return;
    }

    res.json({ analysis });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analysis' });
  }
};
