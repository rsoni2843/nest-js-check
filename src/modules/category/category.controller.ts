import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryArgs } from './dto/category.body';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('category')
//@UseGuards(AuthGuard)
export class CategoryController {
  constructor(private CategoryService: CategoryService) {}

  @Post()
  async create(@Body('data') data: CategoryArgs) {
    const createdCategory = await this.CategoryService.create(data);

    return {
      message: 'category created successfully',
      category: createdCategory,
    };
  }

  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.CategoryService.list(page, size);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return await this.CategoryService.get(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body('data') data: CategoryArgs) {
    return await this.CategoryService.update(id, data);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.CategoryService.deleteCategory(id);

    return {
      message: 'Deleted Successfully',
    };
  }
}
