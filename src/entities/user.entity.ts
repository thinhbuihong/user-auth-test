import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  firstName: string;

  @Column({ charset: 'utf8mb4', collation: 'utf8mb4_unicode_ci' })
  lastName: string;

  @Column({ nullable: true })
  picture: string;

  @Column({ unique: true })
  googleId: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
