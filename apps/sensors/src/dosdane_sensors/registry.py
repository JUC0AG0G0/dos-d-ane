"""Découverte des capteurs installés via les entry points Python."""

from __future__ import annotations

from importlib.metadata import entry_points

from dosdane_sensors.base import Sensor

ENTRY_POINT_GROUP = "dosdane_sensors.sensors"


def available_sensors() -> dict[str, type[Sensor]]:
    """Renvoie {nom: classe} pour tous les capteurs installés."""
    found: dict[str, type[Sensor]] = {}
    for ep in entry_points(group=ENTRY_POINT_GROUP):
        cls = ep.load()
        if not (isinstance(cls, type) and issubclass(cls, Sensor)):
            raise TypeError(f"{ep.value} n'hérite pas de dosdane_sensors.Sensor")
        found[ep.name] = cls
    return found


def create_sensors(names: list[str], device_id: str) -> list[Sensor]:
    """Instancie les capteurs demandés, identifiés par `<device_id>-<nom>`."""
    registry = available_sensors()
    unknown = [n for n in names if n not in registry]
    if unknown:
        known = ", ".join(sorted(registry)) or "aucun"
        raise ValueError(f"Capteur(s) inconnu(s) : {', '.join(unknown)} (installés : {known})")
    return [registry[name](f"{device_id}-{name}") for name in names]
