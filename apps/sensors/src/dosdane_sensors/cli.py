"""Point d'entrée : `dosdane-sensors run` (service) ou `dosdane-sensors list`."""

from __future__ import annotations

import argparse
import logging
import signal
import threading

from dosdane_sensors.client import ApiClient
from dosdane_sensors.config import Settings
from dosdane_sensors.registry import available_sensors, create_sensors

log = logging.getLogger("dosdane_sensors")


def run(settings: Settings, once: bool = False, stop: threading.Event | None = None) -> None:
    stop = stop or threading.Event()
    sensors = create_sensors(settings.sensors, settings.device_id)
    client = ApiClient(settings.api_url, settings.api_key)
    for sensor in sensors:
        sensor.setup()
    log.info(
        "Démarrage (%s) : %s vers %s",
        settings.env,
        ", ".join(s.sensor_id for s in sensors),
        settings.api_url,
    )
    try:
        while not stop.is_set():
            for sensor in sensors:
                try:
                    client.send(sensor.measure())
                except Exception:
                    log.exception("Lecture impossible sur %s", sensor.sensor_id)
            if once:
                break
            stop.wait(settings.interval_seconds)
    finally:
        for sensor in sensors:
            sensor.close()
        if client.pending:
            log.warning("%d mesure(s) non envoyée(s) à l'arrêt", len(client.pending))


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="dosdane-sensors")
    parser.add_argument("-v", "--verbose", action="store_true")
    sub = parser.add_subparsers(dest="command", required=True)
    run_parser = sub.add_parser("run", help="lit les capteurs et envoie les mesures")
    run_parser.add_argument("--once", action="store_true", help="une seule lecture puis arrêt")
    sub.add_parser("list", help="liste les capteurs installés")
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )

    if args.command == "list":
        for name, cls in sorted(available_sensors().items()):
            print(f"{name}\t{cls.__module__}.{cls.__qualname__}")
        return 0

    stop = threading.Event()
    # systemd envoie SIGTERM à l'arrêt du service.
    signal.signal(signal.SIGTERM, lambda *_: stop.set())
    signal.signal(signal.SIGINT, lambda *_: stop.set())
    run(Settings.from_env(), once=args.once, stop=stop)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
