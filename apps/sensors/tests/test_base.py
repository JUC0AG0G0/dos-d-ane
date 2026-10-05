from datetime import UTC, datetime

from dosdane_sensors import Measurement
from dosdane_sensors.sensors.fake import FakeSensor


def test_payload_au_format_de_l_api():
    m = Measurement(
        sensor_id="rpi-1-fake",
        sensor_type="fake",
        values={"pitch": 12.5},
        timestamp=datetime(2026, 10, 5, 10, 0, tzinfo=UTC),
    )
    assert m.to_payload() == {
        "sensorId": "rpi-1-fake",
        "sensorType": "fake",
        "timestamp": "2026-10-05T10:00:00Z",
        "values": {"pitch": 12.5},
    }


def test_fake_sensor_est_reproductible_avec_une_graine():
    a = FakeSensor("a", seed=42).measure()
    b = FakeSensor("b", seed=42).measure()
    assert a.values == b.values
    assert set(a.values) == {"pitch", "roll"}
    assert a.sensor_type == "fake"
