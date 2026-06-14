import { Router } from 'express';
import { analyzeResume, getAnalyses, getAnalysisById } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/analyze', analyzeResume);
router.get('/', getAnalyses);
router.get('/:id', getAnalysisById);

export default router;
