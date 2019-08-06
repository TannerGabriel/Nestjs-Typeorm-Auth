import {
  Entity,
  Column,
  BeforeInsert,
  ObjectIdColumn,
  BeforeUpdate,
} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

const passwordHashedRegex = RegExp('\\$2[ayb]$[d]{2}$[./A-Za-z0-9]{53}');

@Entity('user')
export class UserEntity {
  @ObjectIdColumn()
  _id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  verified: boolean = false;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    try {
      const rounds = bcrypt.getRounds(this.password);
      if (rounds === 0) {
        this.password = await bcrypt.hash(this.password, 10);
      }
    } catch (error) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
}
