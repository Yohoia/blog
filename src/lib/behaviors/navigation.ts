import type { SiteNavigationEvent } from "@/types/elements";
type Push = (href: string, options: { scroll: boolean }) => void;
let push: Push | undefined;
let current: URL | undefined;
let pending: SiteNavigationEvent | undefined;
let complete: (() => void) | undefined;
function event(name: string, data: Omit<SiteNavigationEvent, keyof Event>) {
  return Object.assign(new Event(name), data) as SiteNavigationEvent;
}
function prepare(url: URL, type: "push" | "traverse", sourceElement?: Element) {
  const data = {
    from: current ?? new URL(location.href),
    to: url,
    navigationType: type,
    newDocument: document,
    sourceElement,
    viewTransition: { ready: Promise.resolve(), skipTransition: () => {} },
  };
  document.dispatchEvent(event("site:before-preparation", data));
  document.dispatchEvent(event("site:before-swap", data));
  pending = event("site:after-swap", data);
}
export function configureNavigation(routerPush: Push) {
  push = routerPush;
  current ??= new URL(location.href);
}
export function navigate(
  href: string,
  options: { sourceElement?: Element } = {},
): Promise<void> {
  const target = new URL(href, location.href);
  if (!push) {
    location.assign(target.href);
    return Promise.resolve();
  }
  prepare(target, "push", options.sourceElement);
  const done = new Promise<void>((resolve) => {
    complete = resolve;
  });
  const base = (path: string) =>
    path.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  const language =
    !!current &&
    current.pathname !== target.pathname &&
    base(current.pathname) === base(target.pathname);
  push(target.pathname + target.search + target.hash, { scroll: !language });
  return done;
}
export function prepareHistory() {
  prepare(new URL(location.href), "traverse");
}
export function commitNavigation() {
  if (pending) {
    document.dispatchEvent(pending);
    pending = undefined;
  }
  current = new URL(location.href);
  document.documentElement.lang = current.pathname.startsWith("/en")
    ? "en"
    : "zh-CN";
  const plain =
    current.pathname.replace(/^\/en(?=\/|$)/, "").replace(/\/+$/, "") || "/";
  document.documentElement.classList.toggle(
    "scrollbar-hidden",
    plain === "/" || plain.startsWith("/blog"),
  );
  document.dispatchEvent(new Event("site:page-load"));
  complete?.();
  complete = undefined;
}
