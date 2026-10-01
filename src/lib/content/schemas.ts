import { reference, type SchemaContext } from 'astro:content';
import { z } from 'astro/zod';
import { finderCategories } from '../../config/categories';

const title = z.string().trim().min(1);
const tags = z.array(z.string().trim().min(1)).default([]);
const httpUrl = z.url({ protocol: /^https?$/ });
const metadata = {
  title,
  description: z.string().trim().min(1),
  draft: z.boolean().default(false),
};

const dates = {
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
};

const validDateOrder = (data: { publishedAt: Date; updatedAt?: Date }) =>
  !data.updatedAt || data.updatedAt >= data.publishedAt;

const dateOrderMessage = {
  message: 'updatedAt must not be earlier than publishedAt',
  path: ['updatedAt'],
};

export const writingSchema = ({ image }: SchemaContext) =>
  z
    .object({
      ...metadata,
      ...dates,
      tags,
      language: z.enum(['zh', 'en']).default('zh'),
      author: z.string().trim().min(1).optional(),
      topic: z.string().trim().min(1).optional(),
      cover: image().optional(),
      coverAlt: z.string().trim().min(1).optional(),
    })
    .refine(validDateOrder, dateOrderMessage);

export const fragmentSchema = z
  .object({
    ...metadata,
    ...dates,
    tags,
    related: z.array(reference('fragments')).default([]),
  })
  .refine(validDateOrder, dateOrderMessage);

export const projectSchema = ({ image }: SchemaContext) =>
  z
    .object({
      ...metadata,
      ...dates,
      tags,
      kind: z.enum(['project', 'experiment', 'creation']).default('project'),
      status: z
        .enum(['in-progress', 'completed', 'archived'])
        .default('completed'),
      stack: z.array(z.string().trim().min(1)).default([]),
      url: httpUrl.optional(),
      repository: httpUrl.optional(),
      cover: image().optional(),
      coverAlt: z.string().trim().min(1).optional(),
    })
    .refine(validDateOrder, dateOrderMessage);

export const finderSchema = z.object({
  ...metadata,
  url: httpUrl,
  category: z.enum(finderCategories),
  addedAt: z.coerce.date(),
  tags,
  note: z.string().optional(),
});

export const staticPageSchema = z.object({
  ...metadata,
  updatedAt: z.coerce.date(),
});
