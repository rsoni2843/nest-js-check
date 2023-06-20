import { TEXT, INTEGER, STRING, DATE, FLOAT, ENUM, BOOLEAN } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  AutoIncrement,
  HasMany,
  BelongsToMany,
  IsUrl,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Category } from './category.entity';
import { ProductCategory } from './product-category';
import { PricingLog } from './pricing-log.entity';
import { ProductCompetitor } from './product-competitor.entity';
import { ProductPricingLog } from './product-pricing-log.entity';
import { Brand } from './brand.entity';
export enum marketPositionType {
  CHEAPEST = 'cheapest',
  AVERAGE = 'average',
  COSTLIER = 'costlier',
  CHEAPER = 'cheaper',
  COSTLIEST = 'costliest',
}
@Table({
  tableName: 'product',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
  deletedAt: 'deleted_at', //this will add a column deleted_at
})
export class Product extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  id: number;

  @Column({ type: STRING, allowNull: false })
  name: string;

  @Column({ type: TEXT, allowNull: true })
  description: string;

  @BelongsToMany(() => Category, () => ProductCategory)
  categories: Category[];

  @IsUrl
  @Column({ type: TEXT, allowNull: false })
  product_url: string;

  @Column({ type: FLOAT.UNSIGNED, allowNull: false })
  base_price: number;

  @Column({ type: STRING, allowNull: false })
  product_code: string;

  @Column({ type: STRING })
  bar_code: string;

  @Column({
    type: ENUM,
    values: Object.values(marketPositionType),
  })
  market_position: marketPositionType;

  @BelongsTo(() => Brand)
  brand: Brand;

  @ForeignKey(() => Brand)
  brand_id: number;

  @HasMany(() => ProductPricingLog)
  pricing_logs: ProductPricingLog[];

  @HasMany(() => ProductCompetitor)
  product_competitors: ProductCompetitor[];

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DATE })
  deleted_at: Date;

  @Column({ type: BOOLEAN, allowNull: false, defaultValue: false, comment: 'In stock status' })
  in_stock: boolean;
}
