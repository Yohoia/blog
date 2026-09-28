import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  writingSchema,
  finderSchema,
  fragmentSchema,
  staticPageSchema,
  projectSchema,
} from './lib/content/schemas';

const markdownLoader = (section: string) =>
  glob({ base: `./src/content/${section}`, pattern: '**/*.{md,mdx}' });

export const collections = {
  writing: defineCollection({
    loader: markdownLoader('writing'),
    schema: writingSchema,
  }),
  fragments: defineCollection({
    loader: markdownLoader('fragments'),
    schema: fragmentSchema,
  }),
  projects: defineCollection({
    loader: markdownLoader('projects'),
    schema: projectSchema,
  }),
  finder: defineCollection({
    loader: glob({
      base: './src/content/finder',
      pattern: '**/*.{md,mdx,json}',
    }),
    schema: finderSchema,
  }),
  now: defineCollection({
    loader: markdownLoader('now'),
    schema: staticPageSchema,
  }),
  profile: defineCollection({
    loader: markdownLoader('profile'),
    schema: staticPageSchema,
  }),
};
