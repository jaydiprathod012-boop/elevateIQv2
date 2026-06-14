import { Router } from 'express';
import { uploadResume, getResumes, getActiveResume, deleteResume } from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.use(authenticate);

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/active', getActiveResume);
router.delete('/:id', deleteResume);

export default router;
