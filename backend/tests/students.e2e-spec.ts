import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';

let token: string;

describe('Students (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // Login as admin to get token
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'admin', password: 'adminpass' });
    token = res.body.access_token;
  });

  it('POST /api/v1/students should create a student', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/students')
      .set('Authorization', `Bearer ${token}`)
      .send({
        first_name: 'John',
        last_name: 'Doe',
        dob: '2010-01-01',
        gender: 'Male',
        admission_date: '2020-09-01'
      });
    expect(res.status).toBe(201);
    expect(res.body.first_name).toBe('John');
  });

  it('GET /api/v1/students returns list', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/students')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // Add more tests for edit, delete...
});