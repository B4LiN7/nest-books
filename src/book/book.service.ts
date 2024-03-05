import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Book } from './book/book';
import { BookDto } from './book/book.dto';

@Injectable()
export class BookService {
  private books: Book[] = [];

  getBooks(): Book[] {
    return this.books;
  }

  getBook(id: number): Book {
    const book = this.books.find((book) => book.id == id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  createBook(book: BookDto): Book {
    this.checkBook(book);
    const usedIds = this.books.map((book) => book.id);
    const newId = Math.max(...usedIds, 0) + 1;
    const newBook = { id: newId, ...book } as Book;
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id: number, book: BookDto): Book {
    this.checkId(id);
    this.checkBook(book);
    const foundBook = this.getBook(id);
    Object.assign(foundBook, book);
    return this.getBook(id);
  }

  deleteBook(id: number): Book {
    this.checkId(id);
    const foundBook = this.getBook(id);
    const foundBookIndex = this.books.indexOf(foundBook);
    this.books.splice(foundBookIndex, 1);
    return foundBook;
  }

  private checkId(id: number): void {
    if (isNaN(id)) {
      throw new BadRequestException('ID must be a number');
    } else if (id < 0) {
      throw new BadRequestException('ID must be a positive number');
    }
  }

  private checkBook(book: BookDto): void {
    if (!book.title || !book.author || !book.releaseYear) {
      throw new BadRequestException('Some book properties are missing');
    } else if (book.releaseYear > new Date().getFullYear()) {
      throw new BadRequestException('Release year cannot be in the future');
    }
  }
}
