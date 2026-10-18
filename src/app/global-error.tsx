"use client";
export default function GlobalError() {
  return (
    <html lang="zh-CN">
      <body
        style={{
          fontFamily: "sans-serif",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
        }}
      >
        <main>
          <h1>500 · 暂时无法显示页面</h1>
          <a href="/">返回首页 / Home</a>
        </main>
      </body>
    </html>
  );
}
