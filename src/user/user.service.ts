import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  picture?: string;
  googleId: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { googleId } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.userRepository.update(id, updateData);
    return this.findById(id);
  }

  async findOrCreate(googleProfile): Promise<User> {
    const { emails, name, photos, id: googleId } = googleProfile;

    let user = await this.findByGoogleId(googleId);

    if (!user) {
      user = await this.findByEmail(emails[0].value);

      if (!user) {
        user = await this.create({
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0]?.value,
          googleId,
        });
      } else {
        user = await this.update(user.id, { googleId });
      }
    }

    return user;
  }
}
