"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
let initialized:
  Promise<typeof import("@/lib/behaviors/navigation")> | undefined;
function initialize() {
  return (initialized ??= (async () => {
    const navigation = await import("@/lib/behaviors/navigation");
    const modules = await Promise.all([
      import("@/lib/behaviors/theme"),
      import("@/lib/behaviors/logo"),
      import("@/lib/behaviors/terminal"),
      import("@/lib/behaviors/terminal-contacts"),
      import("@/lib/behaviors/website-config"),
      import("@/lib/behaviors/background-organic"),
      import("@/lib/behaviors/blog"),
      import("@/lib/behaviors/article-toc"),
      import("@/lib/behaviors/article-rail"),
      import("@/lib/behaviors/dida-preview"),
      import("@/lib/behaviors/clipper-preview"),
      import("@/lib/behaviors/project-links"),
      import("@/lib/behaviors/skills"),
      import("@/lib/behaviors/navigation-transition"),
      import("@/lib/behaviors/error-page"),
    ]);
    modules[0].initializeTheme();
    modules[1].registerLogo();
    modules[2].registerTerminal();
    modules[3].registerTerminalContacts();
    modules[4].registerWebsiteConfig();
    modules[5].initializeOrganicBackground();
    modules[6].registerBlogArchive();
    modules[7].registerArticleToc();
    modules[8].registerArticleRail();
    modules[9].registerDidaPreview();
    modules[10].registerClipperPreview();
    modules[11].registerProjectLinks();
    modules[12].registerSkillsGrid();
    modules[13].initializeNavigationTransition();
    modules[14].initializeErrorPage();
    document.addEventListener("click", (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !(event.target instanceof Element)
      )
        return;
      const link = event.target.closest<HTMLAnchorElement>("a[href]");
      if (
        !link ||
        link.target === "_blank" ||
        link.hasAttribute("download") ||
        link.hasAttribute("data-native-navigation")
      )
        return;
      const url = new URL(link.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol))
        return;
      if (url.pathname === location.pathname && url.search === location.search)
        return;
      event.preventDefault();
      void navigation.navigate(url.href, { sourceElement: link });
    });
    window.addEventListener("popstate", navigation.prepareHistory);
    return navigation;
  })());
}
export function Runtime() {
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    void initialize().then((navigation) => {
      if (!active) return;
      navigation.configureNavigation((href, options) =>
        router.push(href, options),
      );
      navigation.commitNavigation();
    });
    return () => {
      active = false;
    };
  }, [pathname, router]);
  return null;
}
