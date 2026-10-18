import { renderSitePage } from "@/features/site/page-renderer";
import { getPageMetadata } from "@/features/site/page-metadata";
export function generateMetadata() {
  return getPageMetadata("/en/500");
}
export default function Page() {
  return renderSitePage("/en/500");
}
