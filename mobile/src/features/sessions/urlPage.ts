import Constants from 'expo-constants';

/**
 * URL de public/pose.html : celle du tunnel cloudflared, fournie par
 * `task mobile:start` (EXPO_PUBLIC_PAGE_URL), sinon déduite de l'adresse du dev
 * server Expo — « 192.168.1.20:8081 » (LAN, http => NON sécurisé) ou
 * « xxxx.exp.direct » (tunnel Expo, https => sécurisé).
 */
export function urlPageParDefaut(): string {
  const imposee = process.env.EXPO_PUBLIC_PAGE_URL;
  if (imposee) return imposee;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost ??
    '';
  if (!hostUri) return '';
  const hote = hostUri.split('?')[0];
  const estTunnel = hote.includes('.exp.direct') || hote.includes('.exp.host');
  return estTunnel ? `https://${hote.split(':')[0]}/pose.html` : `http://${hote}/pose.html`;
}
