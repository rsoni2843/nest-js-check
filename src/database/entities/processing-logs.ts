import { TEXT, INTEGER, DATE, FLOAT, ENUM, STRING, JSON } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { UploadLog } from './upload-log';

export enum processing_status {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Table({
  tableName: 'processing_log',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class ProcessingLog extends Model {
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
  product_code: string;

  @Column({
    type: ENUM,
    allowNull: false,
    values: Object.values(processing_status),
  })
  status: processing_status;

  @Column({
    type: JSON,
  })
  message: any[];

  @BelongsTo(() => UploadLog)
  upload_log: UploadLog;

  @ForeignKey(() => UploadLog)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  upload_log_id: number;

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;
}
