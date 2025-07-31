import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../entities/user.entity';

export interface JwtPayload {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile): Promise<User> {
    return this.userService.findOrCreate(profile);
  }

  async login(
    user: User,
  ): Promise<{ access_token: string; user: Omit<User, 'googleId'> }> {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const { googleId, ...userWithoutGoogleId } = user;
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: userWithoutGoogleId,
    };
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.userService.findById(payload.id);
  }
}
