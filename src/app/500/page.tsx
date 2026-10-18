import { headers } from "next/headers";
import { ErrorPage } from "@/components/errors/ErrorPage";
import { getPageMetadata } from "@/features/site/page-metadata";
export function generateMetadata() {
  return getPageMetadata("/500");
}
export default async function Page() {
  const locale = (await headers()).get("x-error-locale") === "en" ? "en" : "zh";
  return <ErrorPage code={500} locale={locale} />;
}
