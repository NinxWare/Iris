import fs from 'node:fs/promises';
import fssync from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
import { z } from 'zod';
import { prisma } from '../prisma/client.js';

const metadataSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().min(5).optional(),
  tags: z.array(z.string()).optional(),
});

const createSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  tags: z.array(z.string()).default([]),
});

export const listModels = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Math.min(Number(req.query.limit || 10), 50);
  const search = req.query.search?.toString() || '';
  const tags = req.query.tags ? req.query.tags.toString().split(',').map((t) => t.trim()) : [];

  const where = {
    AND: [
      search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {},
      tags.length ? { tags: { hasEvery: tags } } : {},
    ],
  };

  const [items, total] = await Promise.all([
    prisma.model.findMany({
      where,
      include: { user: { select: { id: true, name: true } }, files: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.model.count({ where }),
  ]);

  return res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
};

export const getModelById = async (req, res) => {
  const model = await prisma.model.findUnique({
    where: { id: req.params.id },
    include: { files: true, user: { select: { id: true, name: true, avatar: true } } },
  });
  if (!model) return res.status(404).json({ message: 'Modelo não encontrado' });
  return res.json(model);
};

export const createModel = async (req, res) => {
  const payload = {
    ...req.body,
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
  };
  const data = createSchema.parse(payload);

  const model = await prisma.model.create({
    data: {
      name: data.name,
      description: data.description,
      tags: data.tags,
      userId: req.user.id,
    },
  });

  const files = (req.files || []).map((file) => ({
    filename: file.filename,
    original: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    relativeDir: `models/${model.id}`,
    modelId: model.id,
  }));

  if (files.length) {
    await prisma.modelFile.createMany({ data: files });
  }

  const full = await prisma.model.findUnique({ where: { id: model.id }, include: { files: true } });
  return res.status(201).json(full);
};

export const updateModel = async (req, res) => {
  const existing = await prisma.model.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Modelo não encontrado' });
  if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Sem permissão' });

  const data = metadataSchema.parse({ ...req.body, tags: req.body.tags || undefined });
  const updated = await prisma.model.update({ where: { id: req.params.id }, data });
  return res.json(updated);
};

export const deleteModel = async (req, res) => {
  const existing = await prisma.model.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Modelo não encontrado' });
  if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Sem permissão' });

  await prisma.model.delete({ where: { id: req.params.id } });
  await fs.rm(path.resolve(`uploads/models/${req.params.id}`), { recursive: true, force: true });
  return res.status(204).send();
};

export const addFiles = async (req, res) => {
  const existing = await prisma.model.findUnique({ where: { id: req.params.id } });
  if (!existing) return res.status(404).json({ message: 'Modelo não encontrado' });
  if (existing.userId !== req.user.id) return res.status(403).json({ message: 'Sem permissão' });

  const files = (req.files || []).map((file) => ({
    filename: file.filename,
    original: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    relativeDir: `models/${existing.id}`,
    modelId: existing.id,
  }));
  if (files.length) await prisma.modelFile.createMany({ data: files });

  const model = await prisma.model.findUnique({ where: { id: existing.id }, include: { files: true } });
  return res.json(model);
};

export const deleteFile = async (req, res) => {
  const file = await prisma.modelFile.findUnique({ where: { id: req.params.fileId }, include: { model: true } });
  if (!file || file.modelId !== req.params.id) return res.status(404).json({ message: 'Arquivo não encontrado' });
  if (file.model.userId !== req.user.id) return res.status(403).json({ message: 'Sem permissão' });

  await prisma.modelFile.delete({ where: { id: file.id } });
  await fs.rm(path.resolve(`uploads/models/${file.modelId}/${file.filename}`), { force: true });
  return res.status(204).send();
};

export const downloadFile = async (req, res) => {
  const file = await prisma.modelFile.findUnique({ where: { id: req.params.fileId } });
  if (!file || file.modelId !== req.params.id) return res.status(404).json({ message: 'Arquivo não encontrado' });

  const filePath = path.resolve(`uploads/models/${file.modelId}/${file.filename}`);
  if (!fssync.existsSync(filePath)) return res.status(404).json({ message: 'Arquivo indisponível' });

  await prisma.model.update({ where: { id: file.modelId }, data: { downloads: { increment: 1 } } });
  return res.download(filePath, file.original);
};

export const downloadAllFiles = async (req, res) => {
  const model = await prisma.model.findUnique({ where: { id: req.params.id }, include: { files: true } });
  if (!model) return res.status(404).json({ message: 'Modelo não encontrado' });

  res.attachment(`${model.name.replace(/\s+/g, '_')}.zip`);
  const archive = archiver('zip', { zlib: { level: 9 } });
  archive.pipe(res);

  for (const file of model.files) {
    const filePath = path.resolve(`uploads/models/${model.id}/${file.filename}`);
    if (fssync.existsSync(filePath)) archive.file(filePath, { name: file.original });
  }

  await prisma.model.update({ where: { id: model.id }, data: { downloads: { increment: 1 } } });
  archive.finalize();
};
