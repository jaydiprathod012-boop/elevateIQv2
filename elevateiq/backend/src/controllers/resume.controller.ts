import { Response } from 'express';
import path from 'path';
import fs from 'fs';
import { AuthRequest } from '../types';
import prisma from '../config/prisma';
import { resumeParserService } from '../services/resume-parser.service';

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const filePath = req.file.path;
    const rawText = await resumeParserService.parseFile(filePath);
    const parsedData = resumeParserService.extractStructuredData(rawText);

    await prisma.resume.updateMany({
      where: { userId: req.user!.id, isActive: true },
      data: { isActive: false },
    });

    const resume = await prisma.resume.create({
      data: {
        userId: req.user!.id,
        fileName: req.file.originalname,
        fileUrl: `/uploads/${req.file.filename}`,
        parsedText: rawText,
        parsedData: parsedData as object,
        isActive: true,
      },
    });

    res.status(201).json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume.id,
        fileName: resume.fileName,
        uploadedAt: resume.uploadedAt,
        skills: parsedData.skills,
        skillCount: parsedData.skills?.length || 0,
      },
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
};

export const getResumes = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId: req.user!.id },
      orderBy: { uploadedAt: 'desc' },
      select: { id: true, fileName: true, uploadedAt: true, isActive: true, parsedData: true },
    });
    res.json({ resumes });
  } catch {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

export const getActiveResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const resume = await prisma.resume.findFirst({
      where: { userId: req.user!.id, isActive: true },
      orderBy: { uploadedAt: 'desc' },
    });

    if (!resume) {
      res.status(404).json({ error: 'No active resume found' });
      return;
    }

    res.json({ resume });
  } catch {
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
};

export const deleteResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = String(req.params.id);
    const resume = await prisma.resume.findFirst({
      where: { id, userId: req.user!.id },
    });

    if (!resume) {
      res.status(404).json({ error: 'Resume not found' });
      return;
    }

    const filePath = path.join(__dirname, '../../', resume.fileUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await prisma.resume.delete({ where: { id } });
    res.json({ message: 'Resume deleted successfully' });
  } catch {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};
