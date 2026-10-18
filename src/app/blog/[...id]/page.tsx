import { renderSitePage } from "@/features/site/page-renderer";
import { getPageMetadata } from "@/features/site/page-metadata";
type Props = { params: Promise<{ id: string[] }> };
// Re-check publication on every request, including URLs first visited after build.
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  return getPageMetadata("/blog/" + (await params).id.join("/"));
}
export default async function Page({ params }: Props) {
  return renderSitePage("/blog/" + (await params).id.join("/"));
}
