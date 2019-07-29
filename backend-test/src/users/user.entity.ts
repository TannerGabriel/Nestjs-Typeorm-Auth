import {Entity, Column, BeforeInsert, ObjectIdColumn, BeforeUpdate} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';

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

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

}
