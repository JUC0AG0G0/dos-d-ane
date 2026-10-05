"""Configuration lue dans les variables d'environnement.

Sur le Raspberry Pi, systemd les charge depuis /etc/dosdane/sensors.env
(voir deploy/). En local, on peut les exporter dans le shell.
"""

from __future__ import annotations

import os
import socket
from dataclasses import dataclass

ENVIRONMENTS = ("development", "staging", "production")


@dataclass(frozen=True)
class Settings:
    env: str
    api_url: str
    device_id: str

    @classmethod
    def from_env(cls) -> Settings:
        env = os.environ.get("DOSDANE_ENV", "development")
        if env not in ENVIRONMENTS:
            raise ValueError(f"DOSDANE_ENV doit valoir {', '.join(ENVIRONMENTS)}")
        return cls(
            env=env,
            api_url=os.environ.get("DOSDANE_API_URL", "http://localhost:3000/api").rstrip("/"),
            device_id=os.environ.get("DOSDANE_DEVICE_ID") or socket.gethostname(),
        )
