import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseTestingModule } from '../src/database/database.testing.module';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';

describe('UserController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseTestingModule, UsersModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    request(app.getHttpServer()).delete('/users');
    app.close();
  });

  const user: CreateUserDto = {
    email: 'test@test.com',
    password: '!somepassword123!',
  };

  it('Create User', () => {
    return request(app.getHttpServer())
      .post('/users')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.userResponse.email).toEqual(user.email);
        expect(body.userResponse._id).toBeDefined();
        expect(body.userResponse.password).toBeDefined();
      })
      .expect(HttpStatus.CREATED);
  });

  it('get users', () => {
    return request(app.getHttpServer())
      .get('/users/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Should requect duplicated repo', () => {
    return request(app.getHttpServer())
    .post('/users')
    .set('Accept', 'application/json')
    .send(user)
    .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('get repo', () => {
    return request(app.getHttpServer())
    .get(`/users/get/${user.email}`)
    .expect(200)
    .expect(({body}) => {
        expect(body).toBeDefined();
        expect(body.email).toEqual(user.email);
        expect(body._id).toBeDefined();
        expect(body.password).toBeDefined();
    });
  });
});
