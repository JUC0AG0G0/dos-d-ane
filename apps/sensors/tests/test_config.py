import pytest

from dosdane_sensors.config import Settings

KEY = "k" * 32


def test_valeurs_par_defaut():
    s = Settings.from_env({"DOSDANE_SENSOR_API_KEY": KEY, "DOSDANE_DEVICE_ID": "rpi"})
    assert s.api_url == "http://localhost:3000/api"
    assert s.sensors == ["fake"]
    assert s.interval_seconds == 5
    assert s.env == "development"


def test_liste_de_capteurs_et_url_sans_slash_final():
    s = Settings.from_env(
        {
            "DOSDANE_SENSOR_API_KEY": KEY,
            "DOSDANE_API_URL": "https://staging.example/api/",
            "DOSDANE_SENSORS": "imu, tof",
        }
    )
    assert s.api_url == "https://staging.example/api"
    assert s.sensors == ["imu", "tof"]


@pytest.mark.parametrize(
    "overrides, message",
    [
        ({"DOSDANE_SENSOR_API_KEY": "court"}, "DOSDANE_SENSOR_API_KEY"),
        ({"DOSDANE_ENV": "recette"}, "DOSDANE_ENV"),
        ({"DOSDANE_INTERVAL_SECONDS": "0"}, "DOSDANE_INTERVAL_SECONDS"),
        ({"DOSDANE_SENSORS": " , "}, "DOSDANE_SENSORS"),
    ],
)
def test_configuration_invalide(overrides, message):
    with pytest.raises(ValueError, match=message):
        Settings.from_env({"DOSDANE_SENSOR_API_KEY": KEY, **overrides})
