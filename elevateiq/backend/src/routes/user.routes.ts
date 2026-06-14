import { Router } from 'express';
import { updateProfile, getRoadmaps } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);
router.patch('/profile', updateProfile);
router.get('/roadmaps', getRoadmaps);

export default router;
