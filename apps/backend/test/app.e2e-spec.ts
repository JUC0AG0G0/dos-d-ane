import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { setupApp } from './../src/setup.js';

// Défini dans vitest.config.e2e.ts.
const SENSOR_API_KEY = process.env.SENSOR_API_KEY!;

describe('API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    setupApp(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/health', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body).toMatchObject({ status: 'ok', env: 'test' });
      });
  });

  const measurement = {
    sensorId: 'rpi-test',
    sensorType: 'fake',
    timestamp: '2026-10-05T10:00:00.000Z',
    values: { pitch: 10 },
  };

  it('POST /api/measurements refuse une requête sans clé', () => {
    return request(app.getHttpServer())
      .post('/api/measurements')
      .send(measurement)
      .expect(401);
  });

  it('POST /api/measurements refuse un corps invalide', () => {
    return request(app.getHttpServer())
      .post('/api/measurements')
      .set('X-Sensor-Key', SENSOR_API_KEY)
      .send({ ...measurement, sensorType: 'IMU !' })
      .expect(400);
  });

  it('POST puis GET /api/measurements', async () => {
    const server = app.getHttpServer();
    await request(server)
      .post('/api/measurements')
      .set('X-Sensor-Key', SENSOR_API_KEY)
      .send(measurement)
      .expect(201);

    const res = await request(server).get('/api/measurements').expect(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject(measurement);
  });
});
