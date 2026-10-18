import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
// Native Node.js env loading keeps host-provided secrets ahead of local files.
for (const filename of [
  ".env.production.local",
  ".env.local",
  ".env.production",
  ".env",
])
  if (existsSync(filename)) process.loadEnvFile(filename);
const child = spawn(process.execPath, ["server.js"], {
  cwd: path.join(process.cwd(), "release"),
  stdio: "inherit",
  env: {
    ...process.env,
    HOSTNAME: "127.0.0.1",
    PORT: process.env.PORT || "3000",
  },
});
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
