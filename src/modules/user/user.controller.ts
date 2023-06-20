import {
  Body,
  Controller,
  Post,
  Res,
  Req,
  Get,
  UseGuards,
  Patch,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { SignUpDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UserIdFromPayload } from 'src/customDecorators/UserIdFromPayload.decorator';
import { ParseQueryPipe } from 'src/pipes/query-params.pipe';
import { UpdateUserDto } from './dto/user.dto';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get()
  async get(@UserIdFromPayload() userId: string) {
    return await this.userService.get(userId);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Post()
  async signup(@Body() body: SignUpDto) {
    const user = this.userService.createUser(body);
    return user;
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Get('list')
  async getUsersData(
    @Query('page', new ParseQueryPipe(0)) page: number,
    @Query('size', new ParseQueryPipe(10)) size: number,
  ) {
    return await this.userService.list(page, size);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Patch(':userid')
  async updateUsersData(
    @Param('userid') userid: string,
    @Body() updation: UpdateUserDto,
  ) {
    return await this.userService.update(userid, updation);
  }
  @UseGuards(AuthGuard, RoleGuard)
  @Delete(':userid')
  async delete(@Param('userid') userid: string) {
    return await this.userService.delete(userid);
  }
}
