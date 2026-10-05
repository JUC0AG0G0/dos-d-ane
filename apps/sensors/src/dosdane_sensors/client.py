"""Envoi des mesures au backend, sans dépendance externe (urllib)."""

from __future__ import annotations

import json
import logging
import urllib.error
import urllib.request
from collections import deque

from dosdane_sensors.base import Measurement

log = logging.getLogger(__name__)


class ApiClient:
    """Envoie les mesures et garde en mémoire celles qui n'ont pas pu partir.

    Le tampon est borné pour ne pas saturer la RAM du Raspberry Pi si le
    serveur reste injoignable longtemps : les plus anciennes sont perdues.
    """

    def __init__(
        self, api_url: str, api_key: str, timeout: float = 5.0, buffer_size: int = 1000
    ) -> None:
        self.endpoint = f"{api_url}/measurements"
        self.api_key = api_key
        self.timeout = timeout
        self.pending: deque[Measurement] = deque(maxlen=buffer_size)

    def send(self, measurement: Measurement) -> bool:
        """Ajoute la mesure au tampon et tente de tout envoyer. Renvoie True si vide."""
        self.pending.append(measurement)
        while self.pending:
            if not self._post(self.pending[0]):
                return False
            self.pending.popleft()
        return True

    def _post(self, measurement: Measurement) -> bool:
        request = urllib.request.Request(
            self.endpoint,
            data=json.dumps(measurement.to_payload()).encode(),
            method="POST",
            headers={"Content-Type": "application/json", "X-Sensor-Key": self.api_key},
        )
        try:
            with urllib.request.urlopen(request, timeout=self.timeout):
                return True
        except urllib.error.HTTPError as err:
            if 400 <= err.code < 500 and err.code not in (408, 429):
                # Erreur définitive (clé ou format invalide) : inutile de réessayer.
                log.error("Mesure rejetée par l'API (%s) : %s", err.code, err.read()[:200])
                return True
            log.warning("API en erreur (%s), mesure gardée en attente", err.code)
        except (urllib.error.URLError, TimeoutError, OSError) as err:
            log.warning("API injoignable (%s), mesure gardée en attente", err)
        return False
