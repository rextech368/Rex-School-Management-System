import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { username } });
    if (user && await bcrypt.compare(password, user.password_hash)) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.username, dto.password);
    const payload = { sub: user.id, role: user.role };
    const access_token = this.jwtService.sign(payload);
    // Optionally: Save session to Redis or DB
    return { access_token };
  }

  async register(dto: RegisterDto) {
    const exists = await this.usersRepository.findOne({ where: [{ username: dto.username }, { email: dto.email }] });
    if (exists) throw new ConflictException('User already exists');
    const hash = await bcrypt.hash(dto.password, 10);
    const user = this.usersRepository.create({
      username: dto.username,
      email: dto.email,
      password_hash: hash,
      role: dto.role,
    });
    await this.usersRepository.save(user);
    return { message: 'User registered', userId: user.id };
  }
}