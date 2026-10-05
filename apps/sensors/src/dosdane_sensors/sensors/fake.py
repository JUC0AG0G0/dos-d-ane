"""Capteur simulé, pour les tests et les démos sans matériel."""

from __future__ import annotations

import random

from dosdane_sensors.base import Sensor, Value


class FakeSensor(Sensor):
    """Simule l'inclinaison du buste (en degrés) d'une personne assise."""

    sensor_type = "fake"

    def __init__(self, sensor_id: str, seed: int | None = None) -> None:
        super().__init__(sensor_id)
        self._random = random.Random(seed)

    def read(self) -> dict[str, Value]:
        return {
            "pitch": round(self._random.gauss(10, 8), 2),
            "roll": round(self._random.gauss(0, 4), 2),
        }
