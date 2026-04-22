import multer from 'multer';
import path from 'node:path';
import { ensureDir, safeFilename } from '../utils/file.js';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const modelId = req.params.id || req.createdModelId;
      const dir = path.join('uploads/models', modelId || 'temp');
      await ensureDir(dir);
      cb(null, dir);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${safeFilename(file.originalname)}`);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 200 },
});
