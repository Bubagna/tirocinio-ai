#!/usr/bin/env node
import fs from "fs";
import path from "path";

const appDir = process.argv[2] || "APP";
const pkgPath = path.join(appDir, "package.json");

if (!fs.existsSync(pkgPath)) {
  console.error(`package.json not found at: ${pkgPath}`);
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const deps = pkg.dependencies ? Object.keys(pkg.dependencies) : [];
const devDeps = pkg.devDependencies ? Object.keys(pkg.devDependencies) : [];

deps.sort();
devDeps.sort();

const out = {
  appDir,
  deps_count: deps.length,
  devDeps_count: devDeps.length,
  deps,
  devDeps,
};

console.log(JSON.stringify(out, null, 2));
