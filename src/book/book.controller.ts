import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BookService } from './book.service';
import { BookDto } from './book/book.dto';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Get()
  getBooks() {
    return this.bookService.getBooks();
  }

  @Get(':id')
  getBook(@Param('id') id: number) {
    return this.bookService.getBook(id);
  }

  @Post()
  createBook(@Body() book: BookDto) {
    return this.bookService.createBook(book);
  }

  @Put(':id')
  updateBook(@Param('id') id: number, @Body() book: BookDto) {
    return this.bookService.updateBook(id, book);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: number) {
    return this.bookService.deleteBook(id);
  }
}
