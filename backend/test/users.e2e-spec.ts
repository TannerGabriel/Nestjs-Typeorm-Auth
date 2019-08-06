import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseTestingModule } from '../src/database/database.testing.module';
import { UsersModule } from '../src/users/users.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { HttpStatus } from '@nestjs/common';
import { AuthModule } from '../src/auth/auth.module';

describe('UserController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [DatabaseTestingModule, UsersModule, AuthModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete('/users');
    app.close();
  });

  const user: CreateUserDto = {
    username: 'test',
    email: 'test@test.com',
    password: '!somepassword123!',
  };

  const updatedUser: CreateUserDto = {
    username: 'test123',
    email: 'deom@test.com',
    password: '!somenewgreatpassword123!',
  };

  let userId: string;

  it('Create User', () => {
    return request(app.getHttpServer())
      .post('/auth/email/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.userResponse.email).toEqual(user.email);
        expect(body.userResponse.username).toEqual(user.username);
        expect(body.userResponse._id).toBeDefined();
        expect(body.userResponse.password).toBeDefined();
        userId = body.userResponse._id;
      })
      .expect(HttpStatus.CREATED);
  });

  it('get all users', () => {
    return request(app.getHttpServer())
      .get('/users/')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
      });
  });

  it('Should requect duplicated repo', () => {
    return request(app.getHttpServer())
      .post('/auth/email/register')
      .set('Accept', 'application/json')
      .send(user)
      .expect(({ body }) => {
        expect(body.message).toEqual('User already exists');
      })
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('get user', () => {
    return request(app.getHttpServer())
      .get(`/users/email/${user.email}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.email).toEqual(user.email);
        expect(body._id).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.username).toBeDefined();
      });
  });

  it('update user', () => {
    return request(app.getHttpServer())
      .put(`/users/${userId}`)
      .send(updatedUser)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toBeDefined();
        expect(body.email).toEqual(updatedUser.email);
        expect(body.username).toBe(updatedUser.username);
        expect(body._id).toBeDefined();
        expect(body.password).toBeDefined();
        expect(body.password).toBeDefined();
      });
  });
});
