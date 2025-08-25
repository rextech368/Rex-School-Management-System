import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';

describe('Auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/login (POST) should fail for invalid user', () => {
    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send({ username: 'nope', password: 'nope' })
      .expect(401);
  });

  // ...more tests
});