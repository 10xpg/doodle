import { Injectable } from '@nestjs/common';
import type { Password } from 'src/common/types';

@Injectable()
export abstract class HashProvider {
  abstract hash(password: Password): Promise<string>;
  abstract compare(password: Password, hash: string): Promise<boolean>;
}
