import { OmitType } from '@nestjs/swagger';
import { UserDto } from './model.dto';

export class CreateUserDto extends OmitType(UserDto, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
