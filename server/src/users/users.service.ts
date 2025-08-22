import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HashProvider } from 'src/auth/providers/hash.provider';
import { CreateUserDto, UpdatePasswordDto } from './dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashProvider: HashProvider,
  ) {}

  async addNewUser(user: CreateUserDto) {
    try {
      user.password = await this.hashProvider.hash(user.password);
      const newUser = await this.usersRepository.createUser(user);
      return newUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUser(user: string) {
    try {
      const foundUser = await this.usersRepository.findUser(user);
      if (!foundUser) throw new NotFoundException('User not found');
      return foundUser;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await this.usersRepository.findUserById(id);
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.usersRepository.findAllUsers();
      if (users?.length < 1) throw new NotFoundException('Users not found');
      return users;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async removeUser(id: string) {
    try {
      return await this.usersRepository.deleteUser(id);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async changePassword(payload: UpdatePasswordDto) {
    try {
      const { oldPassword, newPassword, email } = payload;
      const user = await this.usersRepository.findUser(email);
      if (!user) throw new NotFoundException('Account not found');
      if (oldPassword === newPassword)
        throw new BadRequestException('Please use a new password');

      const validPwd = await this.hashProvider.compare(
        oldPassword,
        user?.password,
      );

      if (!validPwd) throw new UnauthorizedException('Wrong password provided');
      const newHash = await this.hashProvider.hash(newPassword);
      await this.usersRepository.updatePassword(email, newHash);
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
