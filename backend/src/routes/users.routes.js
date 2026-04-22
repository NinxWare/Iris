import { Router } from 'express';
import multer from 'multer';
import { getUserModels, me, updateMe } from '../controllers/users.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { ensureDir, safeFilename } from '../utils/file.js';

const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      await ensureDir('uploads/avatars');
      cb(null, 'uploads/avatars');
    },
    filename: (req, file, cb) => cb(null, `${Date.now()}_${safeFilename(file.originalname)}`),
  }),
});

const router = Router();

router.get('/me', requireAuth, me);
router.put('/me', requireAuth, uploadAvatar.single('avatar'), updateMe);
router.get('/:userId/models', getUserModels);

export default router;
