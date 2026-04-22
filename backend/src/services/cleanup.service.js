import cron from 'node-cron';
import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '../prisma/client.js';

export const startCleanupJob = () => {
  cron.schedule('0 */6 * * *', async () => {
    const base = path.resolve('uploads/models');
    try {
      const entries = await fs.readdir(base, { withFileTypes: true });
      const models = await prisma.model.findMany({ select: { id: true } });
      const valid = new Set(models.map((m) => m.id));

      await Promise.all(
        entries
          .filter((item) => item.isDirectory() && !valid.has(item.name))
          .map((item) => fs.rm(path.join(base, item.name), { recursive: true, force: true })),
      );
    } catch {
      // Ignora se diretório não existir ou erro transitório
    }
  });
};
