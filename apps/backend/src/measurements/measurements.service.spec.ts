import { MeasurementsService } from './measurements.service.js';

describe('MeasurementsService', () => {
  const base = {
    sensorId: 'test-1',
    timestamp: '2026-10-05T10:00:00.000Z',
    values: { pitch: 12.5 },
  };

  it('attribue un identifiant et renvoie les plus récentes en premier', () => {
    const service = new MeasurementsService();
    service.create({ ...base, sensorType: 'imu' });
    const second = service.create({ ...base, sensorType: 'tof' });

    expect(second.id).toBe(2);
    expect(service.findLatest().map((m) => m.id)).toEqual([2, 1]);
  });

  it('filtre par type de capteur', () => {
    const service = new MeasurementsService();
    service.create({ ...base, sensorType: 'imu' });
    service.create({ ...base, sensorType: 'tof' });

    expect(service.findLatest(100, 'imu')).toHaveLength(1);
  });
});
