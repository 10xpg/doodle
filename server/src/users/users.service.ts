import { Injectable, NotFoundException } from '@nestjs/common';
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
      const user = await this.usersRepository.findCustomer(customer);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAdmin(admin: TokenDto) {
    try {
      const user = await this.usersRepository.findAdmin(admin);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getCustomerById(id: string) {
    try {
      const user = await this.usersRepository.findCustomerById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAdminById(id: string) {
    try {
      const user = await this.usersRepository.findAdminById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllAdmins() {
    try {
      const users = await this.usersRepository.findAllAdmins();
      if (users?.length < 1) throw new NotFoundException('Users not found');
      return users;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllCustomers() {
    try {
      const users = await this.usersRepository.findAllCustomers();
      if (users?.length < 1) throw new NotFoundException('Users not found');
      return users;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeAdmin(id: string) {
    try {
      return await this.usersRepository.deleteAdmin(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeCustomer(id: string) {
    try {
      return await this.usersRepository.deleteCustomer(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
