import { Router } from 'express';
import { saveProject, getSavedProjects, updateProjectStatus, unsaveProject } from '../controllers/project.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/save', saveProject);
router.get('/saved', getSavedProjects);
router.patch('/:id/status', updateProjectStatus);
router.delete('/:id', unsaveProject);

export default router;
