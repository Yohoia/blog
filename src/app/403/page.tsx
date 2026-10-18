import { renderSitePage } from "@/features/site/page-renderer";
import { getPageMetadata } from "@/features/site/page-metadata";
export function generateMetadata() {
  return getPageMetadata("/403");
}
export default function Page() {
  return renderSitePage("/403");
}
