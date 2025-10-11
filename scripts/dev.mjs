import { spawn } from "child_process";

const processes = new Map();
let shuttingDown = false;
let exitCode = 0;

function spawnCommand(label, args) {
  const child = spawn("npm", args, {
    stdio: "inherit",
    shell: true,
    env: process.env,
  });

  processes.set(label, child);

  child.on("exit", (code, signal) => {
    processes.delete(label);

    if (shuttingDown) {
      if (processes.size === 0) {
        process.exit(exitCode);
      }
      return;
    }

    if (signal) {
      exitCode = 1;
      shutdown();
      return;
    }

    if (typeof code === "number" && code !== 0) {
      exitCode = code;
      shutdown();
      return;
    }

    if (processes.size === 0) {
      process.exit(exitCode);
    }
  });
}

function shutdown(code = exitCode) {
  if (shuttingDown) return;
  shuttingDown = true;
  exitCode = code;

  for (const child of processes.values()) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => {
    for (const child of processes.values()) {
      if (!child.killed) {
        child.kill("SIGKILL");
      }
    }
  }, 5000).unref();
}

process.on("SIGINT", () => {
  shutdown(130);
});

process.on("SIGTERM", () => {
  shutdown(143);
});

spawnCommand("client", ["run", "dev", "--workspace", "client"]);
spawnCommand("backend", ["run", "dev", "--workspace", "backend"]);

