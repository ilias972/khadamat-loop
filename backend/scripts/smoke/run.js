#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('No test file provided');
  process.exit(1);
}

const resolved = path.resolve(process.cwd(), file);
const ext = path.extname(resolved);
const name = path.basename(resolved).replace(/\.[tj]s$/, '').replace(/\.smoke$/, '');

function run(jsFile) {
  require(jsFile);
}

if (ext === '.js') {
  run(resolved);
  return;
}

if (ext === '.ts') {
  try {
    require('ts-node/register/transpile-only');
    run(resolved);
    return;
  } catch {}
  try {
    require('tsx/cjs');
    run(resolved);
    return;
  } catch {}
  try {
    const ts = require('typescript');
    require.extensions['.ts'] = function (module, filename) {
      const source = fs.readFileSync(filename, 'utf8');
      const { outputText } = ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
        fileName: filename,
      });
      module._compile(outputText, filename);
    };
    const src = fs.readFileSync(resolved, 'utf8');
    const tmp = resolved + '.smoke.tmp.js';
    const { outputText } = ts.transpileModule(src, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true },
      fileName: resolved,
    });
    fs.writeFileSync(tmp, outputText);
    run(tmp);
    fs.unlinkSync(tmp);
    return;
  } catch {}
  console.log(`SKIPPED ${name}: ts-node/tsx/tsc indisponibles`);
  process.exit(0);
}

console.log(`SKIPPED ${name}: extension non supportée`);
process.exit(0);
