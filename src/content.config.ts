import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { blogSchema, skillSchema, projectSchema } from './lib/content/schemas';

const markdownLoader = (section: string) =>
  glob({ base: `./src/content/${section}`, pattern: '**/*.{md,mdx}' });

export const collections = {
  projects: defineCollection({
    loader: markdownLoader('projects'),
    schema: projectSchema,
  }),
  blog: defineCollection({
    loader: markdownLoader('blog'),
    schema: blogSchema,
  }),
  skills: defineCollection({
    loader: markdownLoader('skills'),
    schema: skillSchema,
  }),
};
