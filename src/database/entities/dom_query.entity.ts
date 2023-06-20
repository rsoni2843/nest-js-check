import { INTEGER, DATE, TEXT, ENUM } from 'sequelize';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  AutoIncrement,
  BelongsTo,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { Product } from './product.entity';
import { Category } from './category.entity';
import { Configuration } from './configuration.entity';
import { ProductCompetitor } from './product-competitor.entity';

export enum query_type {
  DEFAULT = 'default',
  GROUPED = 'grouped',
}
@Table({
  tableName: 'dom_query',
  timestamps: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
})
export class DOM_Query extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({ type: INTEGER.UNSIGNED, allowNull: false })
  id: number;

  @Column({
    type: TEXT,
    allowNull: false,
    comment: 'query to reach DOM element',
  })
  price_query: string;

  @Column({
    type: TEXT,
    allowNull: false,
    comment: 'query to reach Stock DOM element',
  })
  stock_query: string;

  @Column({
    type: TEXT,
    allowNull: true,
    comment: 'query to reach Pattern of stock',
  })
  stock_pattern: string;

  @Column({
    type: ENUM,
    allowNull: false,
    defaultValue: query_type.GROUPED,
    values: Object.values(query_type),
  })
  query_type: string;

  @BelongsTo(() => Configuration)
  configuration: Configuration;

  @ForeignKey(() => Configuration)
  configuration_id: number;

  @HasMany(() => ProductCompetitor)
  product_competitors: ProductCompetitor[];

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;
}
