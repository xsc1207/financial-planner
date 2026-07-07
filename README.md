# Financial Plan

A personal finance planner built with Expo and React Native. The app tracks income, savings, loans, goals, expenses, and forecasts using on-device storage.

## Requirements

- Node.js 20.19.4 or newer (an active LTS release is recommended)
- npm, included with Node.js
- Git
- Expo Go 54 on a physical iOS or Android device
- The computer and phone on the same network for normal LAN development

Optional platform tools:

- Xcode and an iOS Simulator for local iOS development on macOS
- Android Studio and an Android Emulator for local Android development
- An Expo account for EAS preview or production builds

This project uses Expo SDK 54, React Native 0.81, React 19, TypeScript, and Expo Router. No environment variables or external backend are currently required.

## Install

Clone the repository, enter its directory, and install the locked dependencies:

```bash
git clone <repository-url>
cd financial-planner
npm ci
```

Use `npm install` instead of `npm ci` only when intentionally changing dependencies.

## Start the app

Start the Expo development server:

```bash
npm start
```

The terminal displays a QR code and keyboard shortcuts.

### Open on a physical phone

1. Install Expo Go 54 on the phone.
2. Connect the phone and development computer to the same Wi-Fi network.
3. Start the project with `npm start`.
4. On iOS, scan the QR code with the Camera app. On Android, use **Scan QR code** in Expo Go.

If the app still uses an old bundle after dependencies or the Expo SDK change, restart Metro and clear its cache:

```bash
npx expo start --clear
```

`--clear` removes Metro's cached bundle data. It does not delete source code or data stored on the phone.

### Other targets

```bash
npm run ios      # iOS Simulator
npm run android  # Android Emulator
npm run web      # Web browser
```

The corresponding simulator or emulator tooling must already be installed.

## Development checks

Common commands are available through the project Makefile:

```bash
make help
make start
make start-clear
make share
make check
make validate
```

`make help` prints the complete command list. The underlying commands can also be run directly as described below.

Run linting:

```bash
npm run lint
```

Run TypeScript checking:

```bash
npx tsc --noEmit
```

Check Expo package compatibility:

```bash
npx expo-doctor
```

## Share the app with others

### Temporary sharing with Expo Go

For someone on the same network:

1. Run `npm start`.
2. Send or show them the QR code.
3. They open it with Expo Go 54.

For someone on a different network, start a tunnel:

```bash
npx expo start --tunnel
```

Send them the resulting QR code or Expo link. Your computer and the Expo process must remain online while they use the app. Tunnel mode can be slower than LAN mode.

If Expo reports that tunnel support is missing, install it in the project and retry:

```bash
npm install --save-dev @expo/ngrok
npx expo start --tunnel
```

Expo Go sharing is intended for development and testing. It is not a permanent app release.

### Installable preview builds

For repeatable testing without keeping the local development server running, create an EAS preview build. This requires an Expo account and additional EAS build configuration. See the [Expo internal distribution guide](https://docs.expo.dev/build/internal-distribution/).

### Public release

To distribute the app publicly, create signed production builds with EAS and submit them to the Apple App Store and Google Play. Developer accounts and store configuration are required. See the [Expo app store build guide](https://docs.expo.dev/deploy/build-project/).

## Data and privacy

App data is stored locally on each device with AsyncStorage. Data is not currently synchronized, backed up to a server, or shared between users. Deleting the app may delete its stored financial data.

Do not use real sensitive financial information when sharing development or preview versions unless the app's security and backup behavior have been reviewed for that use.

## Troubleshooting

### Project is incompatible with Expo Go

Confirm that Expo Go supports SDK 54 and that this project still reports SDK 54:

```bash
npx expo config --type public
```

Look for:

```text
sdkVersion: '54.0.0'
```

Then restart with:

```bash
npx expo start --clear
```

### Phone cannot connect

- Confirm the phone and computer use the same Wi-Fi network.
- Disable VPNs temporarily if they block local-network traffic.
- Allow incoming connections through the computer firewall.
- Try tunnel mode: `npx expo start --tunnel`.

### Dependency problems

Restore the versions recorded in the lockfile:

```bash
npm ci
npx expo-doctor
```

## Project structure

```text
src/app/         Expo Router screens and layouts
src/components/  Reusable UI components
src/storage/     On-device persistence helpers
src/styles/      Shared styles
src/utils/       Financial summary utilities
assets/          App icons and images
```

## Documentation

- [Expo SDK 54](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Expo Go](https://expo.dev/go)
