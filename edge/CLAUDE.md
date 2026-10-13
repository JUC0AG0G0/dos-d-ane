@AGENTS.md

## Spécifique à Claude Code

- Pour toute action sur le Raspberry Pi (lancer un test, lire la température, commiter depuis le Pi), suivre la skill `pi-edge` (`.claude/skills/pi-edge/SKILL.md`).
- **Demander avant de lancer un programme sur le Pi** qui utilise la webcam ou ouvre une fenêtre (`live.py`, tests) : l'utilisateur préfère souvent le lancer lui-même. Les lectures (température, `git status`, journaux) ne demandent pas d'accord.
- Expliquer simplement et en français : l'utilisateur découvre le Raspberry Pi.
