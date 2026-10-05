import type { ExpoConfig } from 'expo/config';

// APP_ENV choisit la variante de l'application. Les variantes ont des
// identifiants différents pour pouvoir coexister sur un même téléphone.
const appEnv = process.env.EXPO_PUBLIC_APP_ENV ?? 'development';
const suffix = appEnv === 'production' ? '' : `.${appEnv}`;
const nameSuffix = appEnv === 'production' ? '' : ` (${appEnv})`;

const config: ExpoConfig = {
  name: `Dos d'âne${nameSuffix}`,
  slug: 'dos-d-ane',
  version: '0.0.1',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  ios: {
    supportsTablet: true,
    bundleIdentifier: `fr.uha.dosdane${suffix}`,
  },
  android: {
    package: `fr.uha.dosdane${suffix}`,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    favicon: './assets/favicon.png',
  },
};

export default config;
