import { siteConfig } from "@/config/site";
import { terminalLabels } from "@/features/home/home-content";
import type { Locale } from "@/config/locale";
import { brandIcons } from "@/lib/brand";
export function TerminalContacts({ locale }: { locale: Locale }) {
  const labels = terminalLabels[locale];
  const midpoint = Math.ceil(siteConfig.contactLinks.length / 2);
  const left = siteConfig.contactLinks.slice(0, midpoint);
  const right = siteConfig.contactLinks.slice(midpoint);
  return (
    <>
      <terminal-contacts
        className="terminal-links output-block"
        data-terminal-output
      >
        {left.map((contact, index) => (
          <div className="contact-row" key={contact.icon}>
            {[contact, right[index]].map(
              (entry) =>
                entry && (
                  <div className="contact-item" key={entry.icon}>
                    <span
                      className="contact-brand"
                      dangerouslySetInnerHTML={{
                        __html: brandIcons[entry.icon],
                      }}
                    />
                    {"href" in entry ? (
                      <a className="contact-link" href={entry.href}>
                        {entry.label}
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="contact-link copy-contact"
                        title={labels.copyWeChat}
                        aria-label={`${labels.copyWeChat}: ${entry.copyValue}`}
                        data-copy-contact={entry.copyValue}
                        data-copy-success={labels.copiedWeChat}
                        data-copy-failed={labels.copyFailed}
                      >
                        {entry.label}
                      </button>
                    )}
                  </div>
                ),
            )}
          </div>
        ))}
        <p className="sr-only" role="status" data-copy-status></p>
      </terminal-contacts>
    </>
  );
}
