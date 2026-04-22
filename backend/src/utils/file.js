import fs from 'node:fs/promises';
import path from 'node:path';
import sanitize from 'sanitize-filename';

export const safeFilename = (name) => sanitize(name).replace(/\s+/g, '_') || `file_${Date.now()}`;

export const ensureDir = async (dirPath) => {
  await fs.mkdir(dirPath, { recursive: true });
};

export const uploadRoot = path.resolve('uploads/models');
