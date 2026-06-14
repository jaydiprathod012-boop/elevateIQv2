import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import prisma from '../config/prisma';

const saveProjectSchema = z.object({
  projectId: z.string().min(1),
});

const updateStatusSchema = z.object({
  status: z.enum(['SAVED', 'IN_PROGRESS', 'COMPLETED', 'DROPPED']),
  notes: z.string().optional(),
});

export const saveProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = saveProjectSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { projectId } = validation.data;

    const project = await prisma.generatedProject.findUnique({ where: { id: projectId } });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    const saved = await prisma.savedProject.upsert({
      where: { userId_projectId: { userId: req.user!.id, projectId } },
      update: { status: 'SAVED' },
      create: { userId: req.user!.id, projectId, status: 'SAVED' },
    });

    res.status(201).json({ message: 'Project saved', savedProject: saved });
  } catch {
    res.status(500).json({ error: 'Failed to save project' });
  }
};

export const getSavedProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.savedProject.findMany({
      where: { userId: req.user!.id },
      include: { project: true },
      orderBy: { savedAt: 'desc' },
    });
    res.json({ projects });
  } catch {
    res.status(500).json({ error: 'Failed to fetch saved projects' });
  }
};

export const updateProjectStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = updateStatusSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const { status, notes } = validation.data;
    const id = String(req.params.id);

    const updated = await prisma.savedProject.updateMany({
      where: { id, userId: req.user!.id },
      data: { status, notes },
    });

    if (updated.count === 0) {
      res.status(404).json({ error: 'Saved project not found' });
      return;
    }

    res.json({ message: 'Status updated successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to update project status' });
  }
};

export const unsaveProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    await prisma.savedProject.deleteMany({
      where: { id, userId: req.user!.id },
    });
    res.json({ message: 'Project removed from saved' });
  } catch {
    res.status(500).json({ error: 'Failed to unsave project' });
  }
};
