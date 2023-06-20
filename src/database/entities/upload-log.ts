import { TEXT, INTEGER, DATE, FLOAT, ENUM, STRING, JSON } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { ProcessingLog } from './processing-logs';

@Table({
  tableName: 'upload_log',
  timestamps: false,
})
export class UploadLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

  @Column({
    type: STRING,
    allowNull: false,
  })
  uploaded_file: string;

  @Column({
    type: STRING,
  })
  report_file: string;

  @Column({
    type: STRING,
  })
  filename: string;

  @HasMany(() => ProcessingLog)
  processing_logs: ProcessingLog[];
}
