import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpServer } from '@nestjs/common';
import * as request from 'supertest';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('BookController (e2e)', () => {
  let app: INestApplication;
  let httpServer: HttpServer;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();
  });

  it('GET /book', () => {
    return request(httpServer).get('/book').expect(200).expect([]);
  });

  it('GET /book/:id (not exist)', () => {
    return request(httpServer).get('/book/10').expect(404);
  });

  it('GET /book/:id', async () => {
    const addedBook = await request(httpServer).post('/book').send({
      title: 'Title 1',
      author: 'Author 1',
      releaseYear: 2020,
    });
    return request(httpServer).get(`/book/${addedBook.body.id}`).expect(200);
  });

  it('POST /book', () => {
    return request(httpServer)
      .post('/book')
      .send({
        title: 'Title 1',
        author: 'Author 1',
        releaseYear: 2020,
      })
      .expect(201)
      .expect({
        id: 1,
        title: 'Title 1',
        author: 'Author 1',
        releaseYear: 2020,
      });
  });

  it('POST /book (in future)', () => {
    return request(httpServer)
      .post('/book')
      .send({
        title: 'Title 1',
        author: 'Author 1',
        releaseYear: 2025,
      })
      .expect(400);
  });

  it('PUT /book/:id', async () => {
    const addedBook = await request(httpServer).post('/book').send({
      title: 'Title 1',
      author: 'Author 1',
      releaseYear: 2020,
    });
    return request(httpServer)
      .put(`/book/${addedBook.body.id}`)
      .send({
        title: 'Title 2',
        author: 'Author 2',
        releaseYear: 1010,
      })
      .expect(200);
  });

  it('DELETE /book/:id', async () => {
    const addedBook = await request(httpServer).post('/book').send({
      title: 'Title 1',
      author: 'Author 1',
      releaseYear: 2020,
    });
    return request(httpServer).delete(`/book/${addedBook.body.id}`).expect(200);
  });

  afterEach(async () => {
    await app.close();
  });
});
