# ShieldNet — Android Website-Blocking Firewall & DNS Restrictor

ShieldNet is a device-level website and web app restriction application for Android. It operates across **all web browsers** (Google Chrome, Mozilla Firefox, Brave, Samsung Internet, Microsoft Edge, DuckDuckGo) and background apps by implementing a local loopback DNS sinkhole using Android's native `VpnService`.

---

## 🚀 Key Features

- **Device-Wide Restriction**: Any blocked website or web app is halted at the system networking layer across every browser on the device.
- **Subdomain Wildcards**: Block exact domains (`example.com`) or automatically restrict all subdomains (`*.example.com` such as `m.example.com` and `api.example.com`).
- **Content Categories**: Pre-curated blocklists for Social Media, Gaming, Gambling, Video & Streaming, and Adult Content.
- **Automated Schedules**: Set blocking hours (e.g. Study Time, Work Hours, Sleep) with custom day-of-week recurrence.
- **100% Local & Private**: All domain filtering is processed strictly on the device. **Zero data is sent to external servers or remote proxies**.
- **No Root Required**: Built with standard Android SDK 34 APIs conforming to Google Play policies.

---

## 📁 Repository Structure

```
├── android/                   # Full native Android Studio project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── AndroidManifest.xml
│   │   │   ├── java/com/shieldnet/android/
│   │   │   │   ├── MainActivity.kt           # User interface & VPN consent
│   │   │   │   ├── ShieldNetVpnService.kt    # TUN interface & DNS routing
│   │   │   │   ├── DnsPacketParser.kt        # UDP 53 packet parser & 0.0.0.0 sinkhole
│   │   │   │   └── BlocklistManager.kt       # Persistent rules & matching
│   │   │   └── res/                          # Layouts, colors, strings
│   │   └── build.gradle.kts
│   ├── build.gradle.kts
│   ├── settings.gradle.kts
│   └── gradle.properties
│
├── src/                       # Interactive Web Application & Browser Simulator
│   ├── components/            # UI components (Material 3 Light Theme)
│   ├── hooks/                 # Real-time state & DNS engine
│   └── types.ts               # TypeScript schemas
│
└── package.json
```

---

## 🛠️ How to Build the Android APK

### Option A: Using Android Studio (Recommended)

1. Open **Android Studio** (Hedgehog, Iguana, Jellyfish, or newer).
2. Select **File > Open...** and choose the `android` folder in this repository.
3. Wait for Gradle sync to complete.
4. Connect your Android phone with **USB Debugging** enabled (or start an Android Virtual Device / Emulator).
5. Click **Run (Shift + F10)** to install directly on your phone.
6. To generate a standalone APK:
   - Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - The generated APK will be in `android/app/build/outputs/apk/debug/app-debug.apk`.

### Option B: Command Line (Gradle)

```bash
cd android
./gradlew assembleDebug
```

Install via ADB:
```bash
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## 🛡️ How Android Device-Level Blocking Works

1. **VpnService Binding**: When enabled, Android registers a local loopback network interface (`10.1.10.1`).
2. **DNS Port 53 Interception**: The system directs DNS lookups through this virtual TUN interface.
3. **Sinkhole Resolution**:
   - If an app or browser requests a domain in your blocklist, `DnsPacketParser.kt` generates an instant `0.0.0.0` DNS answer.
   - The browser aborts connection immediately with `ERR_NAME_NOT_RESOLVED`.
   - Non-restricted domains are resolved transparently through upstream clean DNS (`1.1.1.1`).
4. **No Battery Drain**: Because only DNS lookups are inspected on UDP port 53, bulk data transfers bypass unnecessary packet overhead.

---

## 📋 Google Play Store Publication Readiness

ShieldNet complies with the Google Play Developer Policy regarding the `VpnService`:
- **Prominent Disclosure**: Users are informed of local loopback filtering prior to requesting VPN permission.
- **Data Safety Form**:
  - No personal data collected.
  - No data shared with third parties.
  - No advertising identifiers used.
- **Foreground Service**: Declares `FOREGROUND_SERVICE_SPECIAL_USE` with explicit system notification.

---

## 📄 License

Apache License 2.0. Open source and free for personal and commercial digital wellbeing applications.
