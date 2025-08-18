#!/usr/bin/env node
const { execSync } = require('child_process');

function get(key) {
  try {
    return execSync(`npm config get ${key}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
}

console.log('registry:', get('registry'));
console.log('@prisma:registry:', get('@prisma:registry'));
console.log('proxy:', get('proxy'));
console.log('https-proxy:', get('https-proxy'));
