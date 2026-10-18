import { cp, mkdir, rm, access } from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const release = path.join(root, "release");
await access(path.join(root, ".next/standalone/server.js"));
await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
await cp(path.join(root, ".next/standalone"), release, { recursive: true });
await cp(path.join(root, "public"), path.join(release, "public"), {
  recursive: true,
});
await cp(path.join(root, ".next/static"), path.join(release, ".next/static"), {
  recursive: true,
});
await cp(path.join(root, "content"), path.join(release, "content"), {
  recursive: true,
});
// Private environment files must be configured on the host, never in the release artifact.
for (const file of [
  ".env",
  ".env.local",
  ".env.production",
  ".env.production.local",
])
  await rm(path.join(release, file), { force: true });
console.log(
  "Standalone release created in release/. Configure environment variables on the host before starting.",
);
