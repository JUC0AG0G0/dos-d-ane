"""Configuration lue dans les variables d'environnement.

Sur le Raspberry Pi, systemd les charge depuis /etc/dosdane/sensors.env
(voir deploy/). En local, on peut les exporter dans le shell.
"""

from __future__ import annotations

import os
import socket
from collections.abc import Mapping
from dataclasses import dataclass

ENVIRONMENTS = ("development", "test", "staging", "production")


@dataclass(frozen=True)
class Settings:
    api_url: str
    api_key: str
    device_id: str
    sensors: list[str]
    interval_seconds: float
    env: str

    @classmethod
    def from_env(cls, environ: Mapping[str, str] | None = None) -> Settings:
        env = os.environ if environ is None else environ
        errors: list[str] = []

        api_url = env.get("DOSDANE_API_URL", "http://localhost:3000/api").rstrip("/")
        api_key = env.get("DOSDANE_SENSOR_API_KEY", "")
        if len(api_key) < 16:
            errors.append("DOSDANE_SENSOR_API_KEY doit contenir au moins 16 caractères")

        app_env = env.get("DOSDANE_ENV", "development")
        if app_env not in ENVIRONMENTS:
            errors.append(f"DOSDANE_ENV doit valoir {', '.join(ENVIRONMENTS)}")

        sensors = [s.strip() for s in env.get("DOSDANE_SENSORS", "fake").split(",") if s.strip()]
        if not sensors:
            errors.append("DOSDANE_SENSORS ne peut pas être vide")

        try:
            interval = float(env.get("DOSDANE_INTERVAL_SECONDS", "5"))
            if interval <= 0:
                raise ValueError
        except ValueError:
            errors.append("DOSDANE_INTERVAL_SECONDS doit être un nombre positif")
            interval = 0.0

        if errors:
            raise ValueError("Configuration invalide : " + "; ".join(errors))

        return cls(
            api_url=api_url,
            api_key=api_key,
            device_id=env.get("DOSDANE_DEVICE_ID") or socket.gethostname(),
            sensors=sensors,
            interval_seconds=interval,
            env=app_env,
        )
