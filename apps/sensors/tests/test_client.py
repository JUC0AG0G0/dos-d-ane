from dosdane_sensors import Measurement
from dosdane_sensors.client import ApiClient

M = Measurement(sensor_id="rpi-fake", sensor_type="fake", values={"pitch": 1.0})


def test_envoie_la_mesure_avec_la_cle(fake_api):
    client = ApiClient(fake_api.url, "secret-key-0123456789")
    assert client.send(M)
    assert fake_api.received[0]["sensorId"] == "rpi-fake"
    assert fake_api.headers[0]["X-Sensor-Key"] == "secret-key-0123456789"


def test_garde_les_mesures_si_le_serveur_est_en_erreur(fake_api):
    client = ApiClient(fake_api.url, "k")
    fake_api.status = 503
    assert not client.send(M)
    assert not client.send(M)
    assert len(client.pending) == 2

    fake_api.status = 201
    assert client.send(M)
    assert len(fake_api.received) == 3
    assert not client.pending


def test_abandonne_une_mesure_rejetee_definitivement(fake_api):
    client = ApiClient(fake_api.url, "k")
    fake_api.status = 400
    assert client.send(M)
    assert not client.pending


def test_garde_les_mesures_si_le_serveur_est_injoignable():
    client = ApiClient("http://127.0.0.1:9/api", "k", timeout=0.5, buffer_size=2)
    for _ in range(3):
        client.send(M)
    assert len(client.pending) == 2  # tampon borné
