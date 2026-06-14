import { Response } from 'express';
import { AuthRequest } from '../types';
import prisma from '../config/prisma';

export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;

    const [user, resumeCount, latestAnalysis, savedProjectsCount, roadmap] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, email: true, avatar: true, createdAt: true },
      }),
      prisma.resume.count({ where: { userId, isActive: true } }),
      prisma.analysis.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: { projects: { take: 6 } },
      }),
      prisma.savedProject.count({ where: { userId } }),
      prisma.roadmap.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const projectStats = await prisma.savedProject.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true },
    });

    res.json({
      user,
      stats: {
        resumeCount,
        savedProjectsCount,
        latestScore: latestAnalysis?.overallScore || 0,
        targetRole: latestAnalysis?.targetRole || null,
      },
      latestAnalysis,
      projectStats,
      roadmap,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};
