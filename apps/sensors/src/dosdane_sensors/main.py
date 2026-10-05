"""Point d'entrée du service (`dosdane-sensors`)."""

from __future__ import annotations

import logging

from dosdane_sensors.config import Settings

log = logging.getLogger("dosdane_sensors")


def main() -> int:
    logging.basicConfig(
        level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s"
    )
    settings = Settings.from_env()
    log.info("Démarrage (%s) sur %s, API : %s", settings.env, settings.device_id, settings.api_url)
    # TODO: lecture des capteurs et envoi des mesures.
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
