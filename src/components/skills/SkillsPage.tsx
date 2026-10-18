import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { ui } from "@/i18n/translations";
import type { SkillEntry } from "@/lib/content";
import { Media } from "@/components/ui/Media";
export function SkillsPage({
  locale,
  skills,
}: {
  locale: Locale;
  skills: SkillEntry[];
}) {
  const text = {
    open: locale === "zh" ? "打开 GitHub 仓库" : "Open GitHub repository",
    empty:
      locale === "zh"
        ? "新的 Skill 会出现在这里。"
        : "New skills will appear here.",
  };
  return (
    <>
      <main
        id="main-content"
        data-width="feature"
        className="site-container skills-page"
      >
        <header className="skills-heading" data-language-block="skills-intro">
          <h1 className="page-title text-page font-semibold" lang="en">
            <span className="title-highlight">
              {ui[locale].navigation.skill}
            </span>
          </h1>
        </header>
        <skills-grid>
          <ol className="skills-grid">
            {skills.map(({ id, data }) => (
              <li key={id} data-language-block={`skill-${id}`}>
                <a
                  className="skill-card"
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${data.title} · ${text.open}`}
                  data-skill-card
                >
                  <div className="skill-visual">
                    <Media
                      src={data.illustration}
                      alt={
                        locale === "zh"
                          ? data.illustrationAlt
                          : data.illustrationAltEn
                      }
                      sizes="(max-width: 420px) calc(100vw - 40px), (max-width: 639px) 381px, (max-width: 829px) calc((100vw - 72px) / 2), 381px"
                      className="skill-illustration"
                      loading="eager"
                      draggable={false}
                      data-skill-art
                    />
                  </div>
                  <div className="skill-content">
                    <div className="skill-title-row">
                      <h2 className="skill-title">{data.title}</h2>
                      <span
                        className="skill-arrow"
                        aria-hidden="true"
                        data-skill-arrow
                      >
                        <ArrowUpRight
                          size={iconTokens.size.normal}
                          strokeWidth={iconTokens.strokeWidth}
                        />
                      </span>
                    </div>
                    <p className="skill-subtitle">
                      {locale === "zh" ? data.subtitle : data.subtitleEn}
                    </p>
                    <p className="skill-description">
                      {locale === "zh" ? data.description : data.descriptionEn}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </skills-grid>
        {!skills.length && <p>{text.empty}</p>}
      </main>
    </>
  );
}
