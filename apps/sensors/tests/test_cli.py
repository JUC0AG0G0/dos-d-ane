from dosdane_sensors.cli import main, run
from dosdane_sensors.config import Settings


def test_run_once_envoie_une_mesure_par_capteur(fake_api):
    settings = Settings.from_env(
        {
            "DOSDANE_API_URL": fake_api.url,
            "DOSDANE_SENSOR_API_KEY": "k" * 32,
            "DOSDANE_DEVICE_ID": "rpi-test",
        }
    )
    run(settings, once=True)
    assert [m["sensorId"] for m in fake_api.received] == ["rpi-test-fake"]


def test_list_affiche_les_capteurs(capsys):
    assert main(["list"]) == 0
    assert "fake" in capsys.readouterr().out
