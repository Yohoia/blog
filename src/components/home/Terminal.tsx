import { siteConfig } from "@/config/site";
import type { Locale } from "@/config/locale";
import { localizePath } from "@/lib/locale-path";
import {
  terminalContent,
  terminalLabels,
  terminalSequence,
} from "@/features/home/home-content";
import { TerminalPrompt } from "./TerminalPrompt";
import { TerminalContacts } from "./TerminalContacts";
import { PixelAvatar } from "./PixelAvatar";
export function Terminal({
  locale,
  latestPosts,
}: {
  locale: Locale;
  latestPosts: { filename: string; anchor: string; date: string }[];
}) {
  const labels = terminalLabels[locale];
  const username = siteConfig.name.toLowerCase();
  const blogUrl = localizePath("/blog", locale);
  const languageHref = locale === "zh" ? "/en" : "/";
  return (
    <>
      <yohoia-terminal
        className="index-introduction"
        data-language-block="introduction"
      >
        <div
          className="introduction-content"
          data-terminal-body
          role="region"
          aria-label={labels.output}
          aria-live="off"
        >
          <p className="last-login c-muted">
            Last login:{" "}
            <time data-terminal-login title={labels.dateFallback}>
              —
            </time>{" "}
            on ttys001
          </p>

          <div data-terminal-history>
            {terminalSequence.map((step) => (
              <div
                key={step.id}
                className="introduction-section"
                data-terminal-step
                data-command={step.command}
              >
                <div
                  className={
                    step.id === "identity" ? "identity-layout" : undefined
                  }
                >
                  <div>
                    <div className="prompt-line">
                      <TerminalPrompt />
                      <span className="cmd-text">{step.command}</span>
                    </div>

                    {step.id === "identity" && (
                      <div
                        className="output-block identity-copy"
                        lang="en"
                        data-terminal-output
                      >
                        <p className="terminal-name c-white">
                          {siteConfig.name}
                        </p>
                        <p className="c-muted">
                          {terminalContent.identity.role}
                        </p>
                        <p className="c-muted">
                          {terminalContent.identity.experience}
                        </p>
                        <p className="c-muted">
                          {terminalContent.identity.location}
                        </p>
                      </div>
                    )}

                    {step.id === "philosophy" && (
                      <div className="output-block" data-terminal-output>
                        <p className="philosophy c-orange" lang="zh-CN">
                          {terminalContent.philosophy.zh}
                        </p>
                        <div className="c-muted" lang="en">
                          {terminalContent.philosophy.en.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {step.id === "websites" && (
                      <div
                        className="output-block"
                        lang="en"
                        data-terminal-output
                      >
                        <ul className="website-list" role="list">
                          {terminalContent.websites.map((website) => (
                            <li
                              className="resource-row website-row"
                              key={website.name}
                            >
                              <a
                                className="resource-link"
                                href={website.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {website.name}
                              </a>
                              <span className="c-muted">
                                {website.description}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {step.id === "posts" && (
                      <div
                        className="output-block posts-output"
                        lang="en"
                        data-terminal-output
                      >
                        <ul className="post-list">
                          {latestPosts.map((post) => (
                            <li className="post-row" key={post.anchor}>
                              <span className="post-meta c-muted">
                                {terminalContent.posts.permissions}
                                {"  "}
                                {username}
                                {"  "}
                                {post.date}
                              </span>
                              <span className="post-details">
                                <a
                                  className="term-link"
                                  href={`${blogUrl}#${post.anchor}`}
                                >
                                  {post.filename}
                                </a>
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="c-muted">{terminalContent.posts.hint}</p>
                        <p>
                          →{" "}
                          <a className="blog-link" href={blogUrl}>
                            <span className="term-link">Blog</span>{" "}
                            <span className="c-muted">— all posts</span>
                          </a>
                        </p>
                      </div>
                    )}

                    {step.id === "tools" && (
                      <div
                        className="output-block"
                        lang="en"
                        data-terminal-output
                      >
                        {terminalContent.tools.map((tool) => (
                          <div className="resource-row" key={tool.name}>
                            <a
                              className="resource-link"
                              href={tool.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {tool.name}
                            </a>
                            <span className="c-muted">{tool.description}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {step.id === "education" && (
                      <div
                        className="output-block output-stack"
                        lang="en"
                        data-terminal-output
                      >
                        {terminalContent.education.map((entry) => (
                          <p key={entry.hash}>
                            <span className="c-yellow">{entry.hash}</span>{" "}
                            <span className="c-muted">{entry.year}</span>{" "}
                            {entry.role}{" "}
                            <span className="c-white">{entry.institution}</span>
                          </p>
                        ))}
                      </div>
                    )}

                    {step.id === "links" && (
                      <TerminalContacts locale={locale} />
                    )}

                    {step.id === "config" && (
                      <div
                        className="output-block config-output"
                        data-terminal-output
                      >
                        <dl className="config-list">
                          <div className="config-row">
                            <dt>Language:</dt>
                            <dd>
                              {locale === "zh" ? (
                                <span
                                  className="config-option is-selected"
                                  lang="en"
                                >
                                  Chinese
                                </span>
                              ) : (
                                <a
                                  className="config-option"
                                  lang="en"
                                  href={languageHref}
                                  data-language-toggle
                                >
                                  Chinese
                                </a>
                              )}
                              <span
                                className="config-separator"
                                aria-hidden="true"
                              >
                                |
                              </span>
                              {locale === "en" ? (
                                <span
                                  className="config-option is-selected"
                                  lang="en"
                                >
                                  English
                                </span>
                              ) : (
                                <a
                                  className="config-option"
                                  lang="en"
                                  href={languageHref}
                                  data-language-toggle
                                >
                                  English
                                </a>
                              )}
                            </dd>
                          </div>
                          <div className="config-row">
                            <dt>DarkMode:</dt>
                            <dd>
                              <button
                                type="button"
                                className="config-option config-theme-dark"
                                data-website-theme="dark"
                              >
                                On
                              </button>
                              <span
                                className="config-separator"
                                aria-hidden="true"
                              >
                                |
                              </span>
                              <button
                                type="button"
                                className="config-option config-theme-light"
                                data-website-theme="light"
                              >
                                Off
                              </button>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                  {step.id === "identity" && (
                    <PixelAvatar label={labels.avatar} />
                  )}
                </div>

                {step.id !== "config" && (
                  <hr
                    className="introduction-divider"
                    data-terminal-divider
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="prompt-line" data-terminal-prompt aria-hidden="true">
            <TerminalPrompt />
            <div className="typing-line">
              <span className="cmd-text" data-terminal-typing></span>
              <span className="cursor" data-terminal-cursor></span>
            </div>
          </div>
        </div>
      </yohoia-terminal>
    </>
  );
}
