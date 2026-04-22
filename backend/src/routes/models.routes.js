import { Router } from 'express';
import {
  addFiles,
  createModel,
  deleteFile,
  deleteModel,
  downloadAllFiles,
  downloadFile,
  getModelById,
  listModels,
  updateModel,
} from '../controllers/models.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', listModels);
router.get('/:id', getModelById);
router.get('/:id/download/:fileId', downloadFile);
router.get('/:id/download-all', downloadAllFiles);

router.post('/', requireAuth, upload.array('files', 20), createModel);
router.put('/:id', requireAuth, updateModel);
router.delete('/:id', requireAuth, deleteModel);
router.post('/:id/files', requireAuth, upload.array('files', 20), addFiles);
router.delete('/:id/files/:fileId', requireAuth, deleteFile);

export default router;
