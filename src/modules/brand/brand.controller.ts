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
import { BrandService } from './brand.service';
import { BrandArgs } from './dto/brand.body';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';
@Controller('brand')
//@UseGuards(AuthGuard)
export class BrandController {
  constructor(private BrandService: BrandService) {}

  @Post()
  async create(@Body('data') data: BrandArgs) {
    const createdCategory = await this.BrandService.create(data);

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
    return await this.BrandService.list(page, size);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return await this.BrandService.get(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body('data') data: BrandArgs) {
    return await this.BrandService.update(id, data);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: number) {
    await this.BrandService.delete(id);

    return {
      message: 'Deleted Successfully',
    };
  }
}
