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
import { Product } from './product.entity';
import { ProductCompetitor } from './product-competitor.entity';

export enum status_enum {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

@Table({
  tableName: 'product_pricing_log',
  timestamps: false,
})
export class ProductPricingLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Product)
  @Column({
    type: INTEGER.UNSIGNED,
  })
  product_id: number;

  @Column({
    type: FLOAT.UNSIGNED,
    allowNull: false,
    comment: 'price before updating',
  })
  price_before: number;

  @Column({
    type: FLOAT.UNSIGNED,
    allowNull: false,
    comment: `price after updating`,
  })
  price_after: number;

  @Column({ type: DATE, allowNull: false, defaultValue: new Date() })
  found_at: Date;

  @Column({
    type: ENUM,
    allowNull: false,
    values: Object.values(status_enum),
  })
  status: status_enum;
}
