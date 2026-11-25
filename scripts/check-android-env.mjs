import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env.android');
let configuredUrl = process.env.VITE_API_BASE_URL || '';

if (!configuredUrl && existsSync(envPath)) {
  const entry = readFileSync(envPath, 'utf8').split(/\r?\n/).find((line) => /^\s*VITE_API_BASE_URL\s*=/.test(line));
  configuredUrl = entry?.replace(/^\s*VITE_API_BASE_URL\s*=\s*/, '').trim().replace(/^['"]|['"]$/g, '') || '';
}

if (!configuredUrl || configuredUrl.includes('your-backend.example.com')) {
  console.error('Android build needs the deployed API URL. Copy .env.android.example to .env.android and set VITE_API_BASE_URL to your HTTPS backend URL ending in /api/v1.');
  process.exit(1);
}

let parsedUrl;
try { parsedUrl = new URL(configuredUrl); } catch {
  console.error('VITE_API_BASE_URL must be a valid URL ending in /api/v1.');
  process.exit(1);
}

if (parsedUrl.protocol !== 'https:' || !parsedUrl.pathname.replace(/\/$/, '').endsWith('/api/v1')) {
  console.error('VITE_API_BASE_URL must use HTTPS and end in /api/v1 for the Android app.');
  process.exit(1);
}
