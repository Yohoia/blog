import type { ReactNode } from "react";
import { randomUUID } from "node:crypto";
import { headerNavigation } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/config/locale";
import { localizePath, unlocalizedPath } from "@/lib/locale-path";
import { logoMarkup } from "@/lib/brand";
import { ui } from "@/i18n/translations";
export function Shell({
  children,
  locale,
  path,
}: {
  children: ReactNode;
  locale: Locale;
  path: string;
}) {
  const current = unlocalizedPath(path);
  const year = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    timeZone: siteConfig.timeZone,
  }).format(new Date());
  const markup = logoMarkup.replaceAll("yhi-", `yohoia-${randomUUID()}-`);
  return (
    <div
      lang={locale === "zh" ? "zh-CN" : "en"}
      className="site-frame organic-background"
    >
      <canvas className="background-organic-canvas" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        {ui[locale].skip}
      </a>
      <header className="site-header">
        <div className="header-shell">
          <div className="header-inner">
            <a
              className="brand-link site-name"
              href={localizePath("/", locale)}
              aria-label={`${siteConfig.name} · ${ui[locale].home}`}
              aria-current={current === "/" ? "page" : undefined}
              data-navigation-transition
            >
              <yohoia-logo
                className="brand-logo"
                dangerouslySetInnerHTML={{ __html: markup }}
              />
            </a>
            <nav className="nav-focus" aria-label={ui[locale].primary}>
              {headerNavigation.map((item) => (
                <a
                  key={item.section}
                  href={localizePath(item.href, locale)}
                  lang="en"
                  aria-current={
                    (
                      item.href === "/"
                        ? current === "/"
                        : current === item.href ||
                          current.startsWith(item.href + "/")
                    )
                      ? "page"
                      : undefined
                  }
                  data-navigation-transition
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </header>
      {children}
      <footer className="site-footer">
        <p className="footer-line">
          <span className="footer-copyright">
            © {year} {siteConfig.name} ·{" "}
          </span>
          <a
            className="footer-registration"
            href={siteConfig.registration.icpUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {siteConfig.registration.icpNumber}
          </a>
        </p>
      </footer>
    </div>
  );
}
