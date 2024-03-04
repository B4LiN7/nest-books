import { Injectable, NotFoundException } from '@nestjs/common';
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
    const usedIds = this.books.map((book) => book.id);
    const newId = Math.max(...usedIds, 0) + 1;
    const newBook = { id: newId, ...book } as Book;
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id: number, book: BookDto): Book {
    const foundBook = this.getBook(id);
    Object.assign(foundBook, book);
    return this.getBook(id);
  }

  deleteBook(id: number): Book {
    const foundBook = this.getBook(id);
    const foundBookIndex = this.books.indexOf(foundBook);
    this.books.splice(foundBookIndex, 1);
    return foundBook;
  }
}
