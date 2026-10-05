import type { SchemaContext } from 'astro:content';
import { z } from 'astro/zod';

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

export const blogSchema = ({ image }: SchemaContext) =>
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

export const skillSchema = ({ image }: SchemaContext) =>
  z.object({
    ...metadata,
    descriptionEn: title,
    subtitle: title,
    subtitleEn: title,
    url: httpUrl,
    illustration: image(),
    illustrationAlt: title,
    illustrationAltEn: title,
    order: z.number().int().nonnegative().default(0),
  });

export const projectSchema = ({ image }: SchemaContext) =>
  z.object({
    ...metadata,
    descriptionEn: title,
    tagline: title,
    taglineEn: title,
    summary: title,
    summaryEn: title,
    category: title,
    categoryEn: title,
    order: z.number().int().nonnegative().default(0),
    stack: tags,
    url: httpUrl,
    repository: httpUrl,
    logo: image(),
    demo: z.enum(['dida']).optional(),
  });
