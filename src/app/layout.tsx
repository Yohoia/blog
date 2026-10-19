import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import { Runtime } from "@/components/layout/Runtime";
import "@/styles/global.css";
export const metadata: Metadata = {
  metadataBase: process.env.SITE_URL
    ? new URL(process.env.SITE_URL)
    : undefined,
  title: { default: "Index | Yohoia", template: "%s | Yohoia" },
  description: "Blog、Project 与 Skill 组成的个人数字空间。",
  icons: {
    icon: [
      { url: "/favicon.png?v=20261019", type: "image/png" },
      { url: "/favicon.ico?v=20261019", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
  },
};
const initialization = `(()=>{try{const p=localStorage.getItem('blog-theme');document.documentElement.dataset.theme=p==='dark'||(p!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}catch{}if(['navigate','reload'].includes(performance.getEntriesByType('navigation')[0]?.type))document.documentElement.dataset.terminalJs='true'})()`;
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: initialization }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <div
          popover="manual"
          aria-hidden="true"
          data-navigation-transition-layer
        >
          <canvas />
        </div>
        <Suspense fallback={null}>
          <Runtime />
        </Suspense>
      </body>
    </html>
  );
}
