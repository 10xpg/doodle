import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GenericTokenDto, PasswordResetSessionDto } from './dto';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addToken(obj: GenericTokenDto) {
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

  async retrieveToken(hash: string) {
    try {
      return await this.prisma.tokenUtil.findUnique({
        where: { tokenHash: hash },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async flagTokenAsUsed(hash: string) {
    try {
      const tk = await this.retrieveToken(hash);
      if (<number>tk?.attempts <= 3) {
        await this.prisma.tokenUtil.update({
          where: { tokenHash: hash },
          data: {
            usedAt: new Date(Date.now()),
            attempts: <number>tk?.attempts + 1,
          },
        });
      }
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addResetSession(obj: PasswordResetSessionDto) {
    const { userId, expiresAt, resetSessionId } = obj;
    try {
      return await this.prisma.passwordResetSession.create({
        data: {
          userId,
          expiresAt,
          resetSessionId,
        },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async flagSessionIdAsUsed(sessionId: string) {
    try {
      return await this.prisma.passwordResetSession.update({
        where: { resetSessionId: sessionId },
        data: { used: true },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
