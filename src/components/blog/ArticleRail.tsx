import {
  ChevronLeft,
  Bell,
  CircleArrowUp,
  Gift,
  MessagesSquare,
  Send,
  ThumbsUp,
} from "lucide-react";
import type { Locale } from "@/config/locale";
import { iconTokens } from "@/config/icons";
import { siteConfig } from "@/config/site";
import type { Heading } from "@/lib/article";
export function ArticleRail({
  locale,
  title,
}: {
  locale: Locale;
  title: string;
}) {
  const label = locale === "zh" ? "文章快捷操作" : "Article actions";
  const text =
    locale === "zh"
      ? {
          progress: "阅读进度",
          top: "回到顶部",
          like: "点赞这篇文章",
          liked: "已点赞这篇文章",
          share: "分享文章",
          copied: "文章链接已复制",
          shareFailed: "无法复制文章链接",
          updates: "通过 GitHub 订阅更新",
          support: "支持 Yohoia",
          comments: "在 GitHub 反馈或评论",
        }
      : {
          progress: "Reading progress",
          top: "Back to top",
          like: "Like this post",
          liked: "Liked this post",
          share: "Share article",
          copied: "Article link copied",
          shareFailed: "Unable to copy article link",
          updates: "Follow updates on GitHub",
          support: "Support Yohoia",
          comments: "Comment or give feedback on GitHub",
        };
  const updatesUrl = `${siteConfig.repositoryUrl}/commits/main.atom`;
  const supportUrl = `${siteConfig.contact.github}?tab=sponsors`;
  const commentsUrl = `${siteConfig.repositoryUrl}/issues`;

  return (
    <>
      <aside className="article-rail" aria-label={label}>
        <article-rail
          data-article-rail-title={title}
          data-top-label={text.top}
          data-like-label={text.like}
          data-liked-label={text.liked}
          data-share-label={text.share}
          data-copied-label={text.copied}
          data-failed-label={text.shareFailed}
        >
          <div className="rail-group">
            <button
              className="rail-action"
              type="button"
              aria-pressed="false"
              data-rail-icon="like"
              data-rail-like
            >
              <ThumbsUp
                size={iconTokens.size.normal}
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
              <span className="rail-count" data-rail-like-count>
                0
              </span>
              <span className="rail-tip" data-rail-like-tip-label>
                {text.like}
              </span>
            </button>

            <button
              className="rail-action"
              type="button"
              aria-label={text.share}
              data-rail-icon="share"
              data-rail-share
            >
              <Send
                size={iconTokens.size.normal}
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
              <span className="rail-tip">{text.share}</span>
            </button>

            <a
              className="rail-action"
              href={updatesUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={text.updates}
              data-rail-icon="bell"
            >
              <Bell
                size={iconTokens.size.normal}
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
              <span className="rail-tip">{text.updates}</span>
            </a>

            <a
              className="rail-action"
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={text.support}
              data-rail-icon="gift"
            >
              <Gift
                size={iconTokens.size.normal}
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
              <span className="rail-tip">{text.support}</span>
            </a>

            <a
              className="rail-action"
              href={commentsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={text.comments}
              data-rail-icon="comment"
            >
              <MessagesSquare
                size={iconTokens.size.normal}
                strokeWidth={iconTokens.strokeWidth}
                aria-hidden="true"
              />
              <span className="rail-tip">{text.comments}</span>
            </a>
          </div>

          <div
            className="rail-progress"
            role="progressbar"
            aria-label={text.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            data-rail-progressbar
          >
            <svg viewBox="0 0 28 28" aria-hidden="true">
              <circle
                className="rail-progress-track"
                cx="14"
                cy="14"
                r="11"
              ></circle>
              <circle
                className="rail-progress-bar"
                cx="14"
                cy="14"
                r="11"
                pathLength="100"
              ></circle>
            </svg>
            <span className="rail-percent" data-rail-percent>
              0%
            </span>
          </div>

          <button
            className="rail-action rail-top"
            type="button"
            data-rail-icon="top"
            data-rail-top
          >
            <CircleArrowUp
              size={iconTokens.size.normal}
              strokeWidth={iconTokens.strokeWidth}
              aria-hidden="true"
            />
            <span>{text.top}</span>
          </button>

          <p className="sr-only" role="status" data-rail-status></p>
        </article-rail>
      </aside>
    </>
  );
}
