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

  async flagFailedAttempt(hash: string) {
    await this.prisma.tokenUtil.update({
      where: { tokenHash: hash },
      data: { attempts: { increment: 1 } },
    });
  }

  async flagTokenAsUsed(hash: string) {
    await this.prisma.tokenUtil.update({
      where: { tokenHash: hash },
      data: { attempts: { increment: 1 }, usedAt: new Date(Date.now()) },
    });
  }

  async addResetSid(obj: PasswordResetSessionDto) {
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

  async retrieveSid(sid: string) {
    try {
      return await this.prisma.passwordResetSession.findUnique({
        where: { resetSessionId: sid },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async flagSidAsUsed(sessionId: string) {
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

  async updatePassword(userId: string, hash: string) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { password: hash },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
