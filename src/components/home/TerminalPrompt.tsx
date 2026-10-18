import { siteConfig } from "@/config/site";
export function TerminalPrompt() {
  const username = siteConfig.name.toLowerCase();
  return (
    <>
      <span className="prompt-prefix" aria-hidden="true">
        <span className="prompt-user">{username}</span>
        <span className="prompt-muted">@</span>
        <span className="prompt-host">space</span>
        <span className="prompt-muted">:~$</span>
      </span>
    </>
  );
}
