import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import type { Password } from 'src/common/types';
import { HashProvider } from './hash.provider';

@Injectable()
export class BcryptProvider implements HashProvider {
  async hash(password: Password) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async compare(password: Password, hash: string) {
    return await bcrypt.compare(password, hash);
  }
}
