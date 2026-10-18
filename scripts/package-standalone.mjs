import {
  access,
  cp,
  mkdir,
  readdir,
  readlink,
  rm,
  symlink,
} from "node:fs/promises";
import path from "node:path";
const root = process.cwd();
const release = path.join(root, "release");
await access(path.join(root, ".next/standalone/server.js"));
await rm(release, { recursive: true, force: true });
await mkdir(release, { recursive: true });
await cp(path.join(root, ".next/standalone"), release, { recursive: true });

// Turbopack can emit absolute dependency symlinks pointing into the original
// .next/standalone build directory. A release is moved to another host, so
// rewrite those links to equivalent paths inside this portable release.
async function makeSymlinksPortable(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await makeSymlinksPortable(entryPath);
      continue;
    }
    if (!entry.isSymbolicLink()) continue;
    const target = await readlink(entryPath);
    if (!target.startsWith("/")) continue;
    const marker = "/.next/standalone/";
    const markerIndex = target.indexOf(marker);
    if (markerIndex === -1) continue;
    const portableTarget = path.relative(
      path.dirname(entryPath),
      path.join(release, target.slice(markerIndex + marker.length)),
    );
    await rm(entryPath, { force: true });
    await symlink(portableTarget, entryPath);
  }
}
await makeSymlinksPortable(release);
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
