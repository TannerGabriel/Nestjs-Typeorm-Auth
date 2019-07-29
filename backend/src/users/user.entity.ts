import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany} from 'typeorm';
import { IsEmail, Validate } from 'class-validator';
import * as bcrypt from 'bcrypt';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  hashPassword() {
    bcrypt.genSalt(10, (err, salt) => {

        if (err) { return err; }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) { return err; }
            this.password = hash;
        });
    });
  }
}
