import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookDto } from './book/book.dto';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  describe('Read', () => {
    it('Should return an empty array', () => {
      expect(service.getBooks()).toEqual([]);
    });

    it('Should return the added book', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const addedBookId = addedBook.id;
      expect(service.getBooks()).toEqual([{ id: addedBookId, ...book }]);
    });

    it('Should throw Not found exception', () => {
      expect(() => {
        service.getBook(1);
      }).toThrow(NotFoundException);
    });
  });

  describe('Create', () => {
    it('Should throw an error because not all field are provided', () => {
      const book = {} as BookDto;
      expect(() => {
        service.createBook(book);
      }).toThrow(BadRequestException);
    });

    it('Should return the added book', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const addedBookId = addedBook.id;
      expect(addedBook).toEqual({ id: addedBookId, ...book });
    });

    it('Should return the array with the added book', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const addedBookId = addedBook.id;
      expect(service.getBook(addedBookId)).toEqual({
        id: addedBookId,
        ...book,
      });
    });

    it('Should throw and error because the release date in the future', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2025,
      };
      expect(() => {
        service.createBook(book);
      }).toThrow(BadRequestException);
    });
  });

  describe('Update', () => {
    it('Should return the updated book', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const updateBook = {
        title: 'Book 123',
        author: 'Author 123123',
        releaseYear: 2020,
      };
      const updatedBook = service.updateBook(addedBook.id, updateBook);
      expect(updatedBook).toEqual({ id: addedBook.id, ...updateBook });
    });

    it('Should throw Not found exception', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const updateBook = {
        title: 'Book 123',
        author: 'Author 123123',
        releaseYear: 2020,
      };
      expect(() => {
        service.updateBook(addedBook.id + 1, updateBook);
      }).toThrow(NotFoundException);
    });

    it('Should throw exception because release year in the future', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      const updateBook = {
        title: 'Book 123',
        author: 'Author 123123',
        releaseYear: 2027,
      };
      expect(() => {
        service.updateBook(addedBook.id + 1, updateBook);
      }).toThrow(BadRequestException);
    });
  });

  describe('Delete', () => {
    it('Should be empty array', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      service.deleteBook(addedBook.id);
      expect(service.getBooks()).toEqual([]);
    });

    it('Should throw Not found exception', () => {
      const book = {
        title: 'Book 1',
        author: 'Author 1',
        releaseYear: 2021,
      };
      const addedBook = service.createBook(book);
      service.deleteBook(addedBook.id);
      expect(() => {
        service.getBook(addedBook.id);
      }).toThrow(NotFoundException);
    });
  });
});
