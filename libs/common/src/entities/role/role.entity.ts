import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';
import { Role as RoleName } from '../../enum/role.enum';

@Entity({ name: 'roles' })
export class Role extends AbstractEntity {
  @Column({ type: 'text' })
  name: RoleName;

  @Column({ length: 200, nullable: true, default: null })
  description?: string;
}
