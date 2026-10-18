import { spawn } from "node:child_process";

// Local development only: forward the existing private services over SSH.
const child = spawn(
  "ssh",
  [
    "-N",
    "-o",
    "BatchMode=yes",
    "-o",
    "StrictHostKeyChecking=yes",
    "-o",
    "ExitOnForwardFailure=yes",
    "-o",
    "ServerAliveInterval=15",
    "-o",
    "ServerAliveCountMax=4",
    "-L",
    "127.0.0.1:15432:127.0.0.1:15432",
    "-L",
    "127.0.0.1:19000:127.0.0.1:19000",
    process.env.PAGEHUSH_TUNNEL_HOST || "blog-aliyun",
  ],
  { stdio: "inherit" },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("error", () => {
  console.error("Unable to start the PageHush SSH tunnel.");
  process.exitCode = 1;
});
child.on("exit", (code) => process.exit(code ?? 1));
