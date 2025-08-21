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

  @ApiOperation({ description: 'List User Accounts' })
  @ApiOkSuccessResponse('Fetched User Accounts', UserResponse, true)
  @ApiNotFoundResponse({
    description: 'Accounts Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get('')
  async getUsers() {
    const users = await this.usersService.getAllUsers();
    return new ApiSuccessResponse('Retrieved users', HttpStatus.OK, users);
  }

  @ApiOperation({
    description: 'Detail User Account',
  })
  @ApiParam({ description: 'unique identifier', name: 'id' })
  @ApiOkSuccessResponse('Fetched User Account', UserResponse, false)
  @ApiNotFoundResponse({
    description: 'Account Not Found',
    type: ApiErrorResponse,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    type: ApiErrorResponse,
  })
  @Get(':id')
  async getUserById(@Param() param: GetUserBaseDto) {
    const { id } = param;
    const user = await this.usersService.getUserById(id);
    return new ApiSuccessResponse('Retrieved user', HttpStatus.OK, user);
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
  @Delete(':id')
  async deleteUser(@Param() param: DeleteUserDto) {
    const { id } = param;
    await this.usersService.removeUser(id);
    return new ApiSuccessBaseResponse(
      'Deleted administrator account',
      HttpStatus.OK,
    );
  }
}
