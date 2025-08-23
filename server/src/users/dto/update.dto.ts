import { PickType } from '@nestjs/swagger';
import { PasswordBaseDto } from 'src/auth/dto';

export class UpdatePasswordDto extends PickType(PasswordBaseDto, [
  'email',
  'oldPassword',
  'newPassword',
] as const) {}
