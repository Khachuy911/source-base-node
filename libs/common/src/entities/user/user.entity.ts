import { hashData } from '@lib/common/utils/hash';
import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { Role } from '../role/role.entity';

@Entity({ name: 'users' })
@Index(['isActive'])
@Index(['username'])
export class User extends AbstractEntity {
  @Column({
    nullable: true,
    length: 200,
  })
  email: string;

  @Column({
    length: 100,
  })
  username: string;

  @Column({
    length: 200,
  })
  password: string;

  @Column({
    default: true,
  })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ default: null })
  refreshToken: string;

  @OneToOne(() => Role, (role) => role.id, { eager: true, createForeignKeyConstraints: false })
  @JoinColumn()
  role: Role;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hashData(this.password);
  }
}
