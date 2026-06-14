import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../types';
import prisma from '../config/prisma';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  avatar: z.string().url().optional(),
});

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const validation = updateProfileSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.user!.id },
      data: validation.data,
      select: { id: true, name: true, email: true, avatar: true },
    });

    res.json({ message: 'Profile updated', user: updated });
  } catch {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getRoadmaps = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const roadmaps = await prisma.roadmap.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ roadmaps });
  } catch {
    res.status(500).json({ error: 'Failed to fetch roadmaps' });
  }
};
