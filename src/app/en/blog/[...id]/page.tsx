import { renderSitePage } from "@/features/site/page-renderer";
import { getPageMetadata } from "@/features/site/page-metadata";
type Props = { params: Promise<{ id: string[] }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  return getPageMetadata("/en/blog/" + (await params).id.join("/"));
}
export default async function Page({ params }: Props) {
  return renderSitePage("/en/blog/" + (await params).id.join("/"));
}
