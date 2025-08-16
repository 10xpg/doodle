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
import { ApiOkSuccessResponse } from '../common/decorators';
import {
  GetUserBaseDto,
  DeleteUserDto,
  UpdatePasswordDto,
  UserResponse,
} from './dto';
import { ApiErrorResponse } from '../common/response';
import {
  ApiBody,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ description: 'List Administrator Accounts' })
  @ApiOkSuccessResponse('Fetched Administrator Accounts', UserResponse, true)
  @ApiNotFoundResponse({
    description: 'Accounts Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('admins')
  async getAdminUsers() {
    const users = await this.usersService.getAllAdmins();
    return new ApiSuccessResponse('Retrieved users', HttpStatus.OK, users);
  }

  @ApiOperation({
    description: 'Returns an Administrator Account by unique identifier',
  })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiOkSuccessResponse('Fetched Administrator Account', UserResponse, false)
  @ApiNotFoundResponse({
    description: 'Account Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('admins/:id')
  async getAdminById(@Param() param: GetUserBaseDto) {
    const { id } = param;
    const user = await this.usersService.getAdminById(id);
    return new ApiSuccessResponse('Retrieved user', HttpStatus.OK, user);
  }

  @ApiOperation({ description: 'List Customer Accounts' })
  @ApiOkSuccessResponse('Fetched Customer Accounts', UserResponse, true)
  @ApiNotFoundResponse({
    description: 'Accounts Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('customers')
  async getCustomerUsers() {
    const users = await this.usersService.getAllCustomers();
    return new ApiSuccessResponse('Retrieved customers', HttpStatus.OK, users);
  }

  @ApiOperation({
    description: 'Returns a Customer Account by unique identifier',
  })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiOkSuccessResponse('Fetched Customer Account', UserResponse, false)
  @ApiNotFoundResponse({
    description: 'Account Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('customers/:id')
  async getCustomerById(@Param() param: GetUserBaseDto) {
    const { id } = param;
    const user = await this.usersService.getCustomerById(id);
    return new ApiSuccessResponse('Retrieved customer', HttpStatus.OK, user);
  }

  @ApiOperation({ description: 'Change Password' })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiBody({ description: 'Password details', type: UpdatePasswordDto })
  @ApiOkResponse({
    description: 'Password update successful',
    type: ApiSuccessBaseResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
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

  @ApiOperation({ description: 'Delete account' })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiOkResponse({
    description: 'Account deleted',
    type: ApiSuccessBaseResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Delete('admins/:id')
  async deleteAdmin(@Param() param: DeleteUserDto) {
    const { id } = param;
    await this.usersService.removeAdmin(id);
    return new ApiSuccessBaseResponse(
      'Deleted administrator account',
      HttpStatus.OK,
    );
  }

  @ApiOperation({ description: 'Delete account' })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiOkResponse({
    description: 'Account deleted',
    type: ApiSuccessBaseResponse,
  })
  @ApiUnprocessableEntityResponse({
    description: 'Validation Error',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
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
