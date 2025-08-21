import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(user: CreateUserDto) {
    try {
      const { email, password, lastname, firstname, gender, phone } = user;
      const userExsists = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (userExsists) throw new ConflictException('User already exists');
      const newUser = await this.prisma.user.create({
        data: {
          email,
          password,
          lastname,
          firstname,
          gender,
          phone,
        },
        omit: {
          password: true,
        },
      });
      return newUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUser(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { email },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
          gender: true,
        },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAllUsers() {
    try {
      const users = await this.prisma.user.findMany({
        omit: {
          password: true,
          createdAt: true,
          updatedAt: true,
          role: true,
          gender: true,
        },
      });
      return users;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async updatePassword(email: string, hash: string) {
    try {
      await this.prisma.user.update({
        where: { email },
        data: { password: hash },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.prisma.user.delete({
        where: { id },
      });
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
