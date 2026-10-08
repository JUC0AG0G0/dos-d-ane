---
name: pi-edge
description: Agir sur le Raspberry Pi du projet depuis le PC (SSH) — lire son état (température, ralentissement, journaux), lancer ou arrêter un test de tests_poc/ ou live.py, suivre un test long, commiter et pousser depuis le Pi. À utiliser dès qu'une commande doit s'exécuter sur le Pi plutôt que sur le PC.
---

# Agir sur le Raspberry Pi

Le Pi est un Raspberry Pi 4 (2 Go), Raspberry Pi OS 64 bits (Debian 13), nom `dosdane-pi`. Le dépôt y est cloné dans `~/dos-d-ane` (branche `feat/edge-poc`), l'environnement Python dans `~/dos-d-ane/edge/.venv`.

## 1. Se connecter

Sur le PC de l'utilisateur, l'alias `pi` est défini dans `~/.ssh/config` (clé sans mot de passe) :

```bash
ssh pi 'hostname; uptime -p'
```

Le nom `dosdane-pi.local` ne se résout pas toujours sur le Wi-Fi de l'école. En cas d'échec « Could not resolve hostname », passer par l'IP en gardant la clé d'hôte connue :

```bash
ssh -o HostName=<ip-du-pi> -o HostKeyAlias=dosdane-pi.local pi '…'
```

L'IP peut changer après un redémarrage : la demander à l'utilisateur (icône Wi-Fi du bureau, ou `hostname -I` sur le Pi) si besoin. `sudo` demande un mot de passe : donner la commande à l'utilisateur au lieu de la lancer.

## 2. Lire l'état (sans accord préalable)

```bash
ssh pi 'vcgencmd measure_temp; vcgencmd get_throttled; uptime -p; cd ~/dos-d-ane && git status -sb'
```

- `throttled=0x0` : rien à signaler. Toute autre valeur : sous-tension ou surchauffe, à signaler.
- Température : ~50–57 °C au repos ; ralentissement à partir de 80 °C.
- `uptime` de quelques minutes alors que personne n'a redémarré = redémarrage inattendu → lire `journalctl -b -1 -n 50` (journaux conservés) et `tail ~/surveillance.log` s'il existe.

## 3. Lancer un script (demander d'abord à l'utilisateur)

Toujours depuis `edge/` avec le Python du `.venv`. Vérifier avant qu'aucun autre programme n'utilise la webcam.

**Test court, résultat direct :**

```bash
ssh pi 'cd ~/dos-d-ane/edge && .venv/bin/python -m tests_poc.t2_camera --court'
```

**Test long, en arrière-plan** (survit à la déconnexion SSH) :

```bash
ssh pi 'cd ~/dos-d-ane/edge && nohup .venv/bin/python -u -m tests_poc.t2_camera > resultats/t2_complet.log 2>&1 &'
ssh pi 'tail -5 ~/dos-d-ane/edge/resultats/t2_complet.log'      # suivre
```

**Fenêtre sur l'écran du Pi** (`live.py`), depuis SSH :

```bash
ssh pi 'cd ~/dos-d-ane/edge && XDG_RUNTIME_DIR=/run/user/1000 WAYLAND_DISPLAY=wayland-0 DISPLAY=:0 nohup .venv/bin/python -u live.py > /tmp/live.log 2>&1 &'
```

## 4. Pièges de la ligne de commande

- **`pgrep -f` / `pkill -f` se trouvent eux-mêmes** : la commande SSH contient le motif cherché. Toujours mettre un crochet dans le motif, et ne pas l'écrire en clair ailleurs dans la commande :
  ```bash
  ssh pi 'pgrep -af "[l]ive[.]py"'
  ssh pi 'pkill -f "[.]venv/bin/python -u live[.]py"'
  ```
- **Code Python multi-lignes** : l'envoyer par l'entrée standard avec un heredoc entre apostrophes, pas dans la chaîne SSH (les guillemets échappés y cassent les f-strings) :
  ```bash
  ssh pi 'cd ~/dos-d-ane/edge && .venv/bin/python -' << 'EOF'
  import posture_lib as L
  print(L.temperature_pi())
  EOF
  ```
- **`grep -c` renvoie le code 1 quand il ne trouve rien** : en fin de commande SSH, ça fait passer un « 0 échec » pour une erreur de connexion. Ajouter `|| true` (`grep -c RATÉE fichier.log || true`).
- Copier un fichier : `scp fichier pi:dos-d-ane/edge/`. Préférer modifier dans le dépôt puis `git pull` sur le Pi pour ne pas créer d'écarts.

## 5. Git depuis le Pi

Le Pi pousse par SSH (clé GitHub dédiée), contrairement au PC (HTTPS, push fait par l'utilisateur).

```bash
ssh pi 'cd ~/dos-d-ane && git pull -q --ff-only && git log --oneline -1'
ssh pi 'cd ~/dos-d-ane && git add edge/<fichiers> && git commit -q -m "<message en français>" && git push -q origin feat/edge-poc'
```

Messages courts en français, **sans mention d'IA ni `Co-Authored-By`**. Après un commit sur le Pi, faire `git pull` sur le PC avant d'y commiter ; après un push du PC, faire `git pull` sur le Pi.

## 6. Après un test

Rapporter les chiffres du bilan (captures, échecs, temps, température, `throttled`) et proposer de les reporter dans `docs/poc-raspberry.md` (fiche §7, compte rendu §3.5). Les fichiers de `resultats/` restent sur le Pi et ne sont jamais commités.
