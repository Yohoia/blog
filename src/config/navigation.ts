export const sectionPaths = {
  index: '/',
  blog: '/blog',
  project: '/project',
  skill: '/skill',
} as const;

export type Section = keyof typeof sectionPaths;

export interface NavigationItem {
  section: Section;
  label: string;
  href: (typeof sectionPaths)[Section];
}

export const mainNavigation = [
  { section: 'blog', label: 'Blog', href: sectionPaths.blog },
  { section: 'project', label: 'Project', href: sectionPaths.project },
  { section: 'skill', label: 'Skill', href: sectionPaths.skill },
] as const satisfies readonly NavigationItem[];

export const headerNavigation = [
  { section: 'index', label: 'Index', href: sectionPaths.index },
  ...mainNavigation,
] as const satisfies readonly NavigationItem[];
