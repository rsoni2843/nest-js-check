import { TEXT, INTEGER, STRING, DATE, FLOAT, BOOLEAN } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  Default,
  AutoIncrement,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { Configuration } from './configuration.entity';
import { PricingLog } from './pricing-log.entity';
import { DOM_Query } from './dom_query.entity';

@Table({
  tableName: 'product_competitor',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
  deletedAt: 'deleted_at', //this will add a column deleted_at
})
export class ProductCompetitor extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
    comment: `competitor's ID`,
  })
  id: number;

  @Column({ type: STRING, allowNull: false, comment: `competitor's name` })
  name: string;

  @Column({ type: TEXT, allowNull: false, comment: `competitor's domain` })
  domain: string;

  @Column({ type: TEXT, allowNull: false, comment: `competitor's url` })
  competitor_url: string;

  @Column({ type: FLOAT.UNSIGNED, allowNull: false })
  price: number;

  @Column({
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: 'In stock status',
  })
  in_stock: boolean;

  @BelongsTo(() => Product)
  product: Product;

  @ForeignKey(() => Product)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  product_id: number;

  @BelongsTo(() => Configuration)
  configuration: Configuration;

  @ForeignKey(() => Configuration)
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  configuration_id: number;

  @BelongsTo(() => DOM_Query)
  dom_query: DOM_Query;

  @ForeignKey(() => DOM_Query)
  dom_query_id: number;

  @HasMany(() => PricingLog)
  pricing_logs: PricingLog[];

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DATE })
  deleted_at: Date;
}
