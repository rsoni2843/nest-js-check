import { TEXT, INTEGER, DATE, FLOAT, ENUM, STRING, JSON } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
} from 'sequelize-typescript';
import { ProcessingLog } from './processing-logs';

@Table({
  tableName: 'report_files',
  timestamps: false,
})
export class ReportFiles extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

  @Column({
    type: STRING,
  })
  filename: string;

  @Column({
    type: STRING,
  })
  report_file: string;

  @Column({
    type: JSON,
  })
  filter_options: { [key: string]: any };
}
