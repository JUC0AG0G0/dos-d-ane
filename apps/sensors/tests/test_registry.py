import pytest

from dosdane_sensors.registry import available_sensors, create_sensors
from dosdane_sensors.sensors.fake import FakeSensor


def test_le_capteur_fake_est_decouvert_par_entry_point():
    assert available_sensors()["fake"] is FakeSensor


def test_create_sensors_nomme_les_capteurs_par_appareil():
    [sensor] = create_sensors(["fake"], "rpi-204")
    assert sensor.sensor_id == "rpi-204-fake"


def test_create_sensors_refuse_un_capteur_inconnu():
    with pytest.raises(ValueError, match="lidar"):
        create_sensors(["fake", "lidar"], "rpi-204")
