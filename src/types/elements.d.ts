import type { DetailedHTMLProps, HTMLAttributes } from "react";
type ElementProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>;
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "terminal-contacts": ElementProps;
      "yohoia-terminal": ElementProps;
      "yohoia-logo": ElementProps;
      "blog-archive": ElementProps;
      "article-toc": ElementProps;
      "article-rail": ElementProps;
      "dida-preview": ElementProps;
      "clipper-preview": ElementProps;
      "project-links": ElementProps;
      "skills-grid": ElementProps;
    }
  }
}
export interface SiteNavigationEvent extends Event {
  from: URL;
  to: URL;
  navigationType: "push" | "traverse";
  newDocument: Document;
  sourceElement?: Element;
  viewTransition: { ready: Promise<void>; skipTransition: () => void };
}
declare global {
  interface DocumentEventMap {
    "site:before-preparation": SiteNavigationEvent;
    "site:before-swap": SiteNavigationEvent;
    "site:after-swap": SiteNavigationEvent;
    "site:page-load": SiteNavigationEvent;
  }
}
