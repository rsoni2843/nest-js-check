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
  tableName: 'pricing_log',
  timestamps: true,
  createdAt: 'found_at',
  updatedAt: false,
})
export class PricingLog extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
  })
  id: number;

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

  @Column({ type: DATE, allowNull: false })
  found_at: Date;

  @BelongsTo(() => ProductCompetitor)
  product_competitor: ProductCompetitor;

  @ForeignKey(() => ProductCompetitor)
  @Column({
    type: INTEGER.UNSIGNED,
  })
  product_competitor_id: number;

  @Column({
    type: TEXT,
    comment: 'query to reach DOM element',
  })
  dom_query: string;

  @Column({
    type: FLOAT,
    comment: 'competitor price / dentalkart price',
  })
  index: number;

  @Column({
    type: ENUM,
    allowNull: false,
    values: Object.values(status_enum),
  })
  status: status_enum;
}
