export const sectionPaths = {
  index: '/',
  writing: '/writing/',
  fragments: '/fragments/',
  projects: '/projects/',
  finder: '/finder/',
  news: '/news/',
  now: '/now/',
} as const;

export type Section = keyof typeof sectionPaths;

export interface NavigationItem {
  section: Section;
  label: string;
  href: (typeof sectionPaths)[Section];
}

export const mainNavigation = [
  { section: 'writing', label: 'Writing', href: sectionPaths.writing },
  { section: 'fragments', label: 'Fragments', href: sectionPaths.fragments },
  { section: 'projects', label: 'Projects', href: sectionPaths.projects },
  { section: 'finder', label: 'Finder', href: sectionPaths.finder },
  { section: 'news', label: 'News', href: sectionPaths.news },
] as const satisfies readonly NavigationItem[];

export const secondaryNavigation = [
  { section: 'now', label: 'Now', href: sectionPaths.now },
] as const satisfies readonly NavigationItem[];
