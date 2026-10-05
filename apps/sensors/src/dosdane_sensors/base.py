"""Interface commune à tous les capteurs (contrat « plug and play »)."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import UTC, datetime

Value = float | int | str | bool


@dataclass(frozen=True)
class Measurement:
    """Une mesure, au format attendu par POST /api/measurements.

    RGPD : `values` ne contient que des grandeurs dérivées (angles, distances,
    scores). Les données brutes (images, flux) restent sur l'appareil.
    """

    sensor_id: str
    sensor_type: str
    values: dict[str, Value]
    timestamp: datetime = field(default_factory=lambda: datetime.now(UTC))
    session_id: str | None = None

    def to_payload(self) -> dict[str, object]:
        payload: dict[str, object] = {
            "sensorId": self.sensor_id,
            "sensorType": self.sensor_type,
            "timestamp": self.timestamp.isoformat().replace("+00:00", "Z"),
            "values": self.values,
        }
        if self.session_id:
            payload["sessionId"] = self.session_id
        return payload


class Sensor(ABC):
    """Classe de base d'un capteur.

    Pour ajouter un capteur : hériter de cette classe, définir `sensor_type`,
    implémenter `read()`, puis le déclarer dans le groupe d'entry points
    `dosdane_sensors.sensors` (voir pyproject.toml et docs/capteurs.md).
    """

    #: Type envoyé au backend, en minuscules (ex. "imu", "tof").
    sensor_type: str

    def __init__(self, sensor_id: str) -> None:
        self.sensor_id = sensor_id

    def setup(self) -> None:  # noqa: B027 - facultatif pour les sous-classes
        """Initialise le matériel (bus I2C, port série...)."""

    @abstractmethod
    def read(self) -> dict[str, Value]:
        """Lit le capteur et renvoie des grandeurs déjà traitées localement."""

    def close(self) -> None:  # noqa: B027 - facultatif pour les sous-classes
        """Libère le matériel."""

    def measure(self) -> Measurement:
        return Measurement(
            sensor_id=self.sensor_id, sensor_type=self.sensor_type, values=self.read()
        )
