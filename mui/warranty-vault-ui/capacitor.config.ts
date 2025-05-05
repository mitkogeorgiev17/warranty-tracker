import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mitko.app',
  appName: 'warranty-vault-ui',
  webDir: 'dist',
  server: {
    androidScheme: 'http',
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  // Define URL schemes in plugins configuration instead
  plugins: {
    App: {
      // This is where you define your URL scheme in newer Capacitor versions
      appUrlOpen: {
        scheme: 'vaultapp'
      }
    }
  }
};

export default config;