# Status Keeper - Professional Status Downloader

This is a professional Next.js + Capacitor application for saving WhatsApp statuses, optimized for Tier 1 markets with integrated AdMob support and smart rating features.

## Production Build & Signing (APK/AAB)

To build a signed release for the Play Store, you need an Android Keystore.

### 1. Generate Keystore
Run this command in your terminal to create a production-ready keystore file:

```bash
keytool -genkey -v -keystore android/app/status-keeper-release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias status_keeper_alias
```

**Note:** 
- **Alias name:** `status_keeper_alias` (Keep this for GitHub Secrets).
- **Passwords:** You will be prompted for two passwords. One for the keystore and one for the alias. **Do not lose these!** Use a password manager (like Bitwarden or Google Passwords) to keep track of them.

### 2. View Alias Name
If you ever forget the alias name, run:
```bash
keytool -list -v -keystore android/app/status-keeper-release.jks
```

### 3. Setting up GitHub Actions Signing
The included workflow `.github/workflows/android-build.yml` is configured to sign your app automatically. You need to add the following secrets to your GitHub repository:

1.  **SIGNING_KEY**: The base64 encoded string of your `.jks` file.
    - Convert it using: `openssl base64 -A -in android/app/status-keeper-release.jks`
2.  **ALIAS**: `status_keeper_alias`
3.  **KEY_STORE_PASSWORD**: The password you chose for the keystore.
4.  **KEY_PASSWORD**: The password you chose for the key alias.

## Security Warning
**NEVER commit your `.jks` file to source control.** It is already added to `.gitignore`. If you lose this file or the passwords, you will NOT be able to update your app on the Play Store.

## Features Included
- **App Open Ad**: Shown on app launch for maximum revenue.
- **Native Video Ads**: Integrated seamlessly in the status grid.
- **Interstitial & Rewarded Ads**: Balanced for high performance and user retention.
- **Smart Rating**: Integrated In-App Review logic for Tier 1 markets.
- **Multi-language Support**: English, Spanish, French, and German.
