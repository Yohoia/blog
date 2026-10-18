import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  getBlogEntries,
  getBlogEntry,
  getLatestPosts,
  getProjects,
  getSkills,
} from "@/lib/content";
import { Shell } from "@/components/layout/Shell";
import { Terminal } from "@/components/home/Terminal";
import { BlogPage } from "@/components/blog/BlogPage";
import { ArticlePage } from "@/components/blog/ArticlePage";
import { ProjectsPage } from "@/components/projects/ProjectsPage";
import { SkillsPage } from "@/components/skills/SkillsPage";
import { ErrorPage } from "@/components/errors/ErrorPage";
import type { ErrorCode } from "@/features/errors/error-content";
import { parseSiteRoute } from "./site-route";

export async function renderSitePage(pathname: string) {
  const { locale, path, plain } = parseSiteRoute(pathname);

  if (/^\/(403|404|500|502)$/.test(plain))
    return (
      <ErrorPage code={Number(plain.slice(1)) as ErrorCode} locale={locale} />
    );

  if (
    process.env.BLOG_CONTENT_SOURCE === "pagehush" &&
    (plain === "/" || plain.startsWith("/blog"))
  )
    await connection();

  let content;
  if (plain === "/")
    content = (
      <main
        id="main-content"
        className="site-container index-page"
        data-width="index"
      >
        <h1 className="sr-only">Yohoia · Index</h1>
        <Terminal
          locale={locale}
          latestPosts={getLatestPosts(await getBlogEntries(), locale)}
        />
      </main>
    );
  else if (plain === "/blog")
    content = <BlogPage locale={locale} published={await getBlogEntries()} />;
  else if (plain.startsWith("/blog/")) {
    const entry = await getBlogEntry(plain.slice(6));
    if (!entry) notFound();
    content = <ArticlePage entry={entry} locale={locale} />;
  } else if (plain === "/project")
    content = <ProjectsPage locale={locale} projects={await getProjects()} />;
  else if (plain === "/skill")
    content = <SkillsPage locale={locale} skills={await getSkills()} />;
  else notFound();

  return (
    <Shell key={path} locale={locale} path={path}>
      {content}
    </Shell>
  );
}
