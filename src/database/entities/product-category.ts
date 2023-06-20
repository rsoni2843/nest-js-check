import { INTEGER, DATE } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { Category } from './category.entity';

@Table({
  tableName: 'product_category',
  timestamps: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
})
export class ProductCategory extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Product)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  product_id: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => Category)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  category_id: number;

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;
}
