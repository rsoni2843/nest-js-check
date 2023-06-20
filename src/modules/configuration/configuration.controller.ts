import {
  ConfigurationCreateArgs,
  ConfigurationUpdateArgs,
} from './dto/configuration.dto';
import { ConfigurationService } from './configuration.service';
import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Param,
  ParseIntPipe,
  Body,
  Query,
  ConflictException,
  ParseBoolPipe,
  UseGuards,
} from '@nestjs/common';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('configuration')
//@UseGuards(AuthGuard)
export class ConfigurationController {
  constructor(private ConfigurationService: ConfigurationService) {}
  @Post()
  async create(@Body('data') data: ConfigurationCreateArgs) {
    return await this.ConfigurationService.create(data);
  }

  @Get('domain/:domain')
  async getByDomain(@Param('domain') domain: string) {
    const config = await this.ConfigurationService.getByDomain(domain);

    if (config) {
      throw new ConflictException(
        'configuration for this domain already exist',
      );
    }

    return {
      exists: false,
    };
  }

  @Get('list')
  async list(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
    @Query('dropdown_list') dropdown_list: boolean,
  ) {
    return await this.ConfigurationService.list(page, size, !dropdown_list);
  }

  @Get(':id')
  async get(@Param('id', ParseIntPipe) id: number) {
    return await this.ConfigurationService.get(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body('data') data: ConfigurationUpdateArgs,
  ) {
    return await this.ConfigurationService.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.ConfigurationService.remove(id);
    return {
      message: 'Deleted Successfully',
    };
  }
}
