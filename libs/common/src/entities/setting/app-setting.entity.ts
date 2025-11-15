import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '../common/abstract.entity';

@Entity({ name: 'app_settings' })
export class AppSetting extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    type: 'jsonb',
  })
  value: any;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  previousValue?: string;

  @Column({ nullable: true })
  updatedBy?: string;
}
