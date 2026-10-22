/*
 * Lance l'app en une commande : ouvre le tunnel https cloudflared vers le dev
 * server (la caméra l'exige), attend son adresse, puis lance Expo avec
 * l'adresse de la page caméra. Quitter Expo (Ctrl+C) ferme aussi le tunnel.
 *
 *   npm run demarrer              # ou, depuis la racine : task mobile:start
 *   npm run demarrer -- --clear   # options passées telles quelles à `expo start`
 */
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const PORT = 8081;
/** cloudflared affiche son adresse en quelques secondes ; au-delà, le réseau bloque. */
const DELAI_TUNNEL_MS = 30_000;
const ADRESSE_TUNNEL = /https:\/\/[a-z0-9-]+\.trycloudflare\.com/;
const TUNNEL_CONNECTE = /Registered tunnel connection/;

const portLibre = await new Promise<boolean>((resolve) => {
  const essai = createServer()
    .once('error', () => resolve(false))
    .once('listening', () => essai.close(() => resolve(true)))
    .listen(PORT);
});
if (!portLibre) {
  console.error(
    `Le port ${PORT} est déjà pris : l'app tourne sans doute dans un autre terminal.\n` +
      'Ferme-la (Ctrl+C dans ce terminal), ou utilise-la telle quelle.',
  );
  process.exit(1);
}

const tunnel = spawn(
  process.env.CLOUDFLARED ?? 'cloudflared',
  ['tunnel', '--url', `http://localhost:${PORT}`, '--no-autoupdate'],
  { stdio: ['ignore', 'ignore', 'pipe'] },
);

function arreter(message: string): never {
  console.error(message);
  tunnel.kill();
  process.exit(1);
}

tunnel.on('error', () =>
  arreter(
    'cloudflared introuvable. Installation (binaire unique, sans compte) :\n' +
      '  mkdir -p ~/.local/bin && wget -O ~/.local/bin/cloudflared ' +
      'https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 ' +
      '&& chmod +x ~/.local/bin/cloudflared',
  ),
);

/**
 * Adresse du tunnel, une fois que cloudflared annonce sa connexion à
 * Cloudflare : il affiche l'adresse un peu avant, et la caméra ouverte
 * entre-temps montre « Cloudflare Tunnel error ». On n'interroge pas l'adresse
 * depuis le PC : un nom demandé avant d'exister reste « introuvable » dans le
 * cache DNS du PC pendant plusieurs minutes.
 */
const adresse = await new Promise<string>((resolve) => {
  const delai = setTimeout(
    () => arreter('Le tunnel cloudflared ne répond pas : vérifie la connexion internet du PC.'),
    DELAI_TUNNEL_MS,
  );
  let trouvee: string | null = null;
  let connecte = false;
  tunnel.stderr.on('data', (morceau: Buffer) => {
    const texte = morceau.toString();
    trouvee ??= ADRESSE_TUNNEL.exec(texte)?.[0] ?? null;
    connecte ||= TUNNEL_CONNECTE.test(texte);
    if (!trouvee || !connecte) return;
    clearTimeout(delai);
    resolve(trouvee);
  });
});

console.log(`Tunnel caméra : ${adresse}\n`);

const expo = spawn('npx', ['expo', 'start', '--port', String(PORT), ...process.argv.slice(2)], {
  stdio: 'inherit',
  env: { ...process.env, EXPO_PUBLIC_PAGE_URL: `${adresse}/pose.html` },
});

expo.on('exit', (code) => {
  tunnel.kill();
  process.exit(code ?? 0);
});
process.on('SIGINT', () => expo.kill('SIGINT'));
process.on('SIGTERM', () => expo.kill('SIGTERM'));
