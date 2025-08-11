import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetUserBaseDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;
}
