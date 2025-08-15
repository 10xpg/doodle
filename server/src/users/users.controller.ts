import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiSuccessBaseResponse,
  ApiSuccessResponse,
} from 'src/common/response';
import { GetUserBaseDto, DeleteUserDto, UpdatePasswordDto } from './dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('admins')
  async getAdminUsers() {
    const users = await this.usersService.getAllAdmins();
    return new ApiSuccessResponse('Retrieved users', HttpStatus.OK, users);
  }

  @Get('admins/:id')
  async getAdminById(@Param() param: GetUserBaseDto) {
    const { id } = param;
    const user = await this.usersService.getAdminById(id);
    return new ApiSuccessResponse('Retrieved user', HttpStatus.OK, user);
  }

  @Get('customers')
  async getCustomerUsers() {
    const users = await this.usersService.getAllCustomers();
    return new ApiSuccessResponse('Retrieved customers', HttpStatus.OK, users);
  }

  @Get('customers/:id')
  async getCustomerById(@Param() param: GetUserBaseDto) {
    const { id } = param;
    const user = await this.usersService.getCustomerById(id);
    return new ApiSuccessResponse('Retrieved customer', HttpStatus.OK, user);
  }

  @Put(':id/password')
  async changePassword(
    @Body()
    body: UpdatePasswordDto,
    @Param()
    params: GetUserBaseDto,
  ) {
    await this.usersService.changePassword(body);
    return new ApiSuccessBaseResponse('Operation successful', HttpStatus.OK);
  }

  @Delete('admins/:id')
  async deleteAdmin(@Param() param: DeleteUserDto) {
    const { id } = param;
    await this.usersService.removeAdmin(id);
    return new ApiSuccessBaseResponse(
      'Deleted administrator account',
      HttpStatus.OK,
    );
  }

  @Delete('customers/:id')
  async deleteCustomer(@Param() param: DeleteUserDto) {
    const { id } = param;
    await this.usersService.removeCustomer(id);
    return new ApiSuccessBaseResponse(
      'Deleted customer account',
      HttpStatus.OK,
    );
  }
}
