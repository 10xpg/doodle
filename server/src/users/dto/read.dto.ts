import { PickType } from '@nestjs/swagger';
import { BaseDto } from 'src/common/dto';

export class GetUserBaseDto extends PickType(BaseDto, ['id'] as const) {}
