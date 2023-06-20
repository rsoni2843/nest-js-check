import { TEXT, INTEGER, DATE, FLOAT, ENUM } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Configuration } from './configuration.entity';

@Table({
  tableName: 'competitor_index',
  timestamps: false,
})
export class CompetitorIndex extends Model {
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

  @BelongsTo(() => Configuration)
  configuration: Configuration;

  @ForeignKey(() => Configuration)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  configuration_id: number;
}
