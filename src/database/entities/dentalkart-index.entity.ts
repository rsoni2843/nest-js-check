import { TEXT, INTEGER, DATE, FLOAT, ENUM } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';

@Table({
  tableName: 'dentalkart_index',
  timestamps: false,
})
export class DentalkartIndex extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

  @Column({
    type: FLOAT,
    allowNull: false,
  })
  index: number;

  @Column({ type: DATE, allowNull: false, defaultValue: new Date() })
  found_at: Date;
}
