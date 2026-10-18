"use client";
import { usePathname } from "next/navigation";
import { ErrorPage } from "@/components/errors/ErrorPage";
export default function ErrorBoundary() {
  const path = usePathname();
  return (
    <ErrorPage code={500} locale={path?.startsWith("/en") ? "en" : "zh"} />
  );
}
