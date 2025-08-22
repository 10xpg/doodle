import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenericTokenDto } from './dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(obj: GenericTokenDto) {
    try {
      const {
        userId,
        hashedToken,
        purpose,
        expiresAt,
        requestIP,
        requestUserAgent,
      } = obj;
      await this.prisma.tokenUtil.create({
        data: {
          userId,
          tokenHash: hashedToken,
          purpose,
          expiresAt,
          requestIP,
          requestUA: requestUserAgent,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
