import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import {
  writingSchema,
  skillSchema,
  fragmentSchema,
  staticPageSchema,
  projectSchema,
} from './lib/content/schemas';

const markdownLoader = (section: string) =>
  glob({ base: `./src/content/${section}`, pattern: '**/*.{md,mdx}' });

export const collections = {
  projects: defineCollection({
    loader: markdownLoader('projects'),
    schema: projectSchema,
  }),
  writing: defineCollection({
    loader: markdownLoader('writing'),
    schema: writingSchema,
  }),
  fragments: defineCollection({
    loader: markdownLoader('fragments'),
    schema: fragmentSchema,
  }),
  skills: defineCollection({
    loader: markdownLoader('skills'),
    schema: skillSchema,
  }),
  now: defineCollection({
    loader: markdownLoader('now'),
    schema: staticPageSchema,
  }),
};
