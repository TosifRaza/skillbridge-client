# SkillBridge Android app

The Android app packages the existing React product with Capacitor. Customer and worker flows stay shared with the website, while Android supplies native app navigation, status/splash branding, camera/microphone permissions, and an ongoing-call foreground notification.

## Configure and build

1. Copy `.env.android.example` to `.env.android`.
2. Set `VITE_API_BASE_URL` to the deployed HTTPS backend URL ending in `/api/v1`. The Android build intentionally stops if this is missing or still a placeholder; `localhost` on a phone refers to the phone itself.
3. Install Android Studio, Android SDK Platform 36, Build Tools 36, and JDK 21.
4. From `frontend`, run `npm install`, then `npm run build:android`.
5. Run `npm run android:open` to open the project in Android Studio. Choose an emulator or connected Android phone and use **Run** to install it.

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk` after a successful Android Studio debug build. To publish, create a release signing key and build a signed AAB in Android Studio.

## Calls on Android

Camera and microphone access are requested by Android when the user starts or answers a call. Once media is active, a native foreground service displays an ongoing call notification and declares the Android microphone/camera foreground-service types. This supports calls when the app is backgrounded, subject to Android, browser/WebView, and device policies. Force-stopping the app, terminating its process, losing network, or closing the call still ends the session. The service notification does not provide call recovery after the WebView process is destroyed.

For stronger call connectivity across carrier NATs, configure the backend `TURN_URLS` and `TURN_SHARED_SECRET` as described in `backend/.env.example`; credentials are minted by the authenticated backend and are not stored in the Android bundle.

## Test on a phone

Use a physical Android phone with updated Android System WebView. Test customer and provider accounts on two devices, grant camera/microphone access, minimize the app during a connected video call, switch apps, return through the ongoing-call notification, switch cameras, and end the call. Emulator WebRTC/camera behavior does not replace this device test.
