import { TEXT, INTEGER, STRING, DATE } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  AutoIncrement,
  BelongsToMany,
  Unique,
  HasMany,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { ProductCategory } from './product-category';

@Table({
  tableName: 'brand',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
  deletedAt: 'deleted_at', //this will add a column deleted_at
})
export class Brand extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({ type: INTEGER.UNSIGNED, allowNull: false, comment: 'brand ID' })
  id: number;

  @Unique
  @Column({ type: STRING, allowNull: false })
  name: string;

  @HasMany(() => Product)
  products: Product[];

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DATE })
  deleted_at: Date;
}
