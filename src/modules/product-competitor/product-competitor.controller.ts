import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ParseQueryPipe,
  ParseSortingPipe,
  sorting_order_type,
} from 'src/pipes/query-params.pipe';
import {
  ProductCompetitorCreateArgs,
  ProductCompetitorUpdateArgs,
} from './dto/product-competitor.body';
import { ProductCompetitorService } from './product-competitor.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('competitor')
//@UseGuards(AuthGuard)
export class ProductCompetitorController {
  constructor(private ProductCompetitorService: ProductCompetitorService) {}

  @Get('test')
  async test() {
    const list = await this.ProductCompetitorService.completeListForScraping(0);
    return list;
  }

  @Post()
  async create(@Body('data') data: ProductCompetitorCreateArgs) {
    const competitor = await this.ProductCompetitorService.create(data);

    return competitor;
  }
  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
    @Query('price', new ParseSortingPipe()) price?: sorting_order_type,
    @Query('created_at', new ParseSortingPipe())
    created_at?: sorting_order_type,
    @Query('updated_at', new ParseSortingPipe())
    updated_at?: sorting_order_type,
    @Query('product_id') product_id?: number,
    @Query('configuration_id') configuration_id?: number,
  ) {
    const sortingParams = this.ProductCompetitorService.getSortingParams(
      price,
      created_at,
      updated_at,
    );
    return await this.ProductCompetitorService.list(
      page,
      size,
      sortingParams,
      product_id,
      configuration_id,
    );
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.ProductCompetitorService.get(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('data') data: ProductCompetitorUpdateArgs,
  ) {
    return await this.ProductCompetitorService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ProductCompetitorService.remove(id);
    return {
      message: 'Deleted Successfully',
    };
  }
}
