import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import { TokenDto } from 'src/auth/dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(customer: CreateUserDto) {
    try {
      const { email, password, lastname, firstname, gender, phone } = customer;
      const customerExists = await this.prisma.customer.findUnique({
        where: {
          email,
        },
      });
      if (customerExists)
        throw new ConflictException('Customer already exists');
      const newCustomer = await this.prisma.customer.create({
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
      return newCustomer;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async createAdmin(admin: CreateUserDto) {
    try {
      const { email, password, lastname, firstname, gender, phone } = admin;
      const adminExists = await this.prisma.admin.findUnique({
        where: { email },
      });
      if (adminExists)
        throw new ConflictException('Administrator already exists');
      const newAdmin = await this.prisma.admin.create({
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
      return newAdmin;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findCustomer(customer: TokenDto) {
    try {
      const { email } = customer;
      const user = await this.prisma.customer.findUnique({
        where: { email },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAdmin(admin: TokenDto) {
    try {
      const { email } = admin;
      const user = await this.prisma.admin.findUnique({
        where: { email },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findCustomerById(id: string) {
    try {
      const user = await this.prisma.customer.findUnique({
        where: { id },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAdminById(id: string) {
    try {
      const user = await this.prisma.admin.findUnique({
        where: { id },
      });
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
