import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';

// The downloadable APK belongs on the website, but must not be nested inside
// the Android APK's WebView assets when building the native application.
await rm(resolve(process.cwd(), 'dist/downloads/SkillBridge-Android.apk'), { force: true });
