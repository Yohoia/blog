import type { NextConfig } from "next";
const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  async redirects() {
    return ["/projects", "/skills", "/en/projects", "/en/skills"].map(
      (source) => ({
        source,
        destination: source
          .replace("projects", "project")
          .replace("skills", "skill"),
        permanent: true,
      }),
    );
  },
};
export default config;
