import Constants from 'expo-constants';

/**
 * Déduit l'URL de public/pose.html depuis l'adresse du dev server Expo.
 * `hostUri` vaut par exemple « 192.168.1.20:8081 » (LAN, http => NON sécurisé)
 * ou « xxxx.exp.direct » (tunnel, https => sécurisé).
 */
export function urlPageParDefaut(): string {
  // Permet d'imposer l'URL depuis le terminal, pour n'avoir rien à taper sur le
  // téléphone quand la page passe par un tunnel externe (cloudflared, ngrok) :
  //   EXPO_PUBLIC_PAGE_URL=https://xxx.trycloudflare.com/pose.html npx expo start
  const imposee = process.env.EXPO_PUBLIC_PAGE_URL;
  if (imposee) return imposee;

  const hostUri =
    Constants.expoConfig?.hostUri ??
    (Constants.expoGoConfig as { debuggerHost?: string } | undefined)?.debuggerHost ??
    '';
  if (!hostUri) return '';
  const hote = hostUri.split('?')[0];
  // Le tunnel Expo sert en https et n'expose pas de port dans l'URL.
  const estTunnel = hote.includes('.exp.direct') || hote.includes('.exp.host');
  return estTunnel ? `https://${hote.split(':')[0]}/pose.html` : `http://${hote}/pose.html`;
}
