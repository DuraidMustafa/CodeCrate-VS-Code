// build.js
const esbuild = require("esbuild");
const path = require("path");

esbuild
  .build({
    entryPoints: ["src/extension.ts"],
    bundle: true,
    platform: "node",
    target: "node18", // or your preferred Node version
    outfile: "dist/extension.js",
    external: ["vscode"], // VS Code API must be marked as external
    sourcemap: "external", // or "hidden" if you want hidden source maps
    format: "cjs", // commonjs module
    logLevel: "info",
  })
  .catch(() => process.exit(1));
