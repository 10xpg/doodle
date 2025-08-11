import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto';
import { HashProvider } from 'src/auth/providers/hash.provider';
import { TokenDto } from 'src/auth/dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async addNewCustomer(customer: CreateUserDto) {
    try {
      customer.password = await this.hashProvider.hash(customer.password);
      const newCustomer = await this.usersRepository.createCustomer(customer);
      return newCustomer;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async addNewAdmin(admin: CreateUserDto) {
    try {
      admin.password = await this.hashProvider.hash(admin.password);
      const newAdmin = await this.usersRepository.createAdmin(admin);
      return newAdmin;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getCustomer(customer: TokenDto) {
    try {
      return await this.usersRepository.findCustomer(customer);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAdmin(admin: TokenDto) {
    try {
      return await this.usersRepository.findAdmin(admin);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getCustomerById(id: string) {
    try {
      return await this.usersRepository.findCustomerById(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAdminById(id: string) {
    try {
      return await this.usersRepository.findAdminById(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
