# Ajouter un capteur

Le paquet `dosdane-sensors` découvre les capteurs par **entry points** Python : un nouveau capteur se branche sans modifier le code existant, ni côté Raspberry Pi ni côté API.

## 1. Écrire la classe

```python
# apps/sensors/src/dosdane_sensors/sensors/imu.py
from dosdane_sensors.base import Sensor, Value


class ImuSensor(Sensor):
    sensor_type = "imu"            # minuscules, envoyé tel quel à l'API

    def setup(self) -> None:
        import smbus2              # import ici : dépendance de l'extra [imu] uniquement
        self._bus = smbus2.SMBus(1)

    def read(self) -> dict[str, Value]:
        # Lire les registres puis calculer des angles : on n'envoie que le résultat.
        return {"pitch": 12.3, "roll": -1.2}

    def close(self) -> None:
        self._bus.close()
```

## 2. Le déclarer dans `pyproject.toml`

```toml
[project.optional-dependencies]
imu = ["smbus2>=0.5"]

[project.entry-points."dosdane_sensors.sensors"]
fake = "dosdane_sensors.sensors.fake:FakeSensor"
imu = "dosdane_sensors.sensors.imu:ImuSensor"
```

Un capteur peut aussi vivre dans un **paquet séparé** qui déclare le même groupe d'entry points : il suffit de l'installer dans le venv du Raspberry Pi.

## 3. Tester

Ajouter un test dans `apps/sensors/tests/` qui simule le matériel (aucun test ne doit dépendre d'un capteur branché, la CI n'en a pas). Puis :

```bash
cd apps/sensors
.venv/bin/pip install -e '.[dev]'   # réinstaller pour enregistrer l'entry point
.venv/bin/dosdane-sensors list      # le nouveau capteur doit apparaître
.venv/bin/pytest
```

## 4. Activer sur le Raspberry Pi

```bash
sudo /opt/dosdane-sensors/venv/bin/pip install '<source>[imu]'
sudo sed -i 's/^DOSDANE_SENSORS=.*/DOSDANE_SENSORS=imu/' /etc/dosdane/sensors.env
sudo systemctl restart dosdane-sensors
```

## Règles

- **Traitement local** : `read()` renvoie des grandeurs dérivées, jamais d'image ni de flux brut (RGPD).
- **Pas d'exception silencieuse** : si la lecture échoue, lever une exception ; la boucle principale la journalise et continue avec les autres capteurs.
- **Imports matériels paresseux** : importer les bibliothèques matérielles dans `setup()` pour que le paquet reste installable et testable sur un PC.
