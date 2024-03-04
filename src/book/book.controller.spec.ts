import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookDto } from './book/book.dto';

// Nincs befejezve, mert végül e2e tesztekkel fogom tesztelni a controllert (és a servicet)

describe('BookController', () => {
  let controller: BookController;
  let mockBookService: BookService;

  beforeEach(async () => {
    mockBookService = {} as BookService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  describe('Read', () => {
    it('Should get books', async () => {
      mockBookService.getBooks = () => {
        return [
          {
            id: 1,
            title: 'Title 1',
            author: 'Author 1',
            releaseYear: 2020,
          },
        ];
      };
      expect(controller.getBooks()).toEqual([
        { id: 1, title: 'Title 1', author: 'Author 1', releaseYear: 2020 },
      ]);
    });

    it('Should get books with id', async () => {
      const index = 42;
      mockBookService.getBook = (index: number) => {
        return {
          id: index,
          title: 'Title 1',
          author: 'Author 1',
          releaseYear: 2020,
        };
      };
      expect(controller.getBook(index)).toEqual({
        id: index,
        title: 'Title 1',
        author: 'Author 1',
        releaseYear: 2020,
      });
    });

    it('Should get empty array', async () => {
      mockBookService.getBooks = () => {
        return [];
      };
      expect(controller.getBooks()).toEqual([]);
    });
  });

  describe('Create', () => {
    it('Should return created book', async () => {
      const book = {
        title: 'Title 1',
        author: 'Author 1',
        releaseYear: 2020,
      } as BookDto;
      mockBookService.createBook = (book: BookDto) => {
        return {
          id: 1,
          ...book,
        };
      };
      expect(controller.createBook(book)).toEqual({
        id: 1,
        ...book,
      });
    });
  });
});
