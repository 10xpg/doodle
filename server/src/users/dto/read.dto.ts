import { PickType } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto';
import { UserDto } from './model.dto';

export class GetUserBaseDto extends PickType(BaseDto, ['id'] as const) {}
export class GetEmailDto extends PickType(UserDto, ['email'] as const) {}
