import { TEXT, INTEGER, UUID, STRING, DATE, BOOLEAN, ENUM } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Unique,
  IsEmail,
} from 'sequelize-typescript';
// import { v4 as uuidv4 } from 'uuid';
export enum roleType {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}
@Table({
  tableName: 'user',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
  deletedAt: 'deleted_at', //this will add a column deleted_at
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: string;

  @Column({ type: STRING, allowNull: false })
  name: string;

  @Unique
  @IsEmail
  @Column({ type: STRING, allowNull: false })
  email: string;

  @Unique
  @Column({ type: STRING, allowNull: false })
  mobile: string;

  @Column({ type: STRING, allowNull: false })
  password: string;

  @Column({
    type: ENUM,
    values: Object.values(roleType),
    defaultValue: roleType.USER,
    allowNull: false,
    comment: 'the role type is for level of authentication',
  })
  role_type: roleType;

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DATE })
  deleted_at: Date;
}
