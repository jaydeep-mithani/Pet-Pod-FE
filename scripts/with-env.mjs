#!/usr/bin/env node
// Loads .env.local into process.env BEFORE spawning the wrapped command.
// Required because `next dev` reads PORT at CLI startup, before Next's own
// .env loader runs — so PORT in .env.local won't take effect otherwise.
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadDotenv } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadDotenv({
  path: path.resolve(__dirname, "../.env.local"),
  quiet: true,
});

const [cmd, ...args] = process.argv.slice(2);
if (!cmd) {
  console.error("Usage: with-env.mjs <cmd> [args...]");
  process.exit(1);
}

const child = spawn(cmd, args, {
  stdio: "inherit",
  env: process.env,
  shell: true,
});
child.on("exit", (code) => process.exit(code ?? 0));
