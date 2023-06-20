import { TEXT, INTEGER, DATE, BOOLEAN, ENUM } from 'sequelize';
import { BelongsTo, ForeignKey, HasMany } from 'sequelize-typescript';
import { ProductCompetitor } from './product-competitor.entity';
import {
  Table,
  Column,
  Model,
  PrimaryKey,
  NotNull,
  AutoIncrement,
} from 'sequelize-typescript';
import { CompetitorIndex } from './competitor-index';
import { DOM_Query } from './dom_query.entity';

export enum queryType {
  PRICE = 'price',
  STOCK = 'stock',
}

@Table({
  tableName: 'configuration',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at', //this will add a column created_at
  updatedAt: 'updated_at', //this will add a column updated_at
  deletedAt: 'deleted_at', //this will add a column deleted_at
})
export class Configuration extends Model {
  @PrimaryKey
  @AutoIncrement
  @NotNull
  @Column({
    type: INTEGER.UNSIGNED,
    allowNull: false,
    comment: `configuration ID`,
  })
  id: number;

  @Column({
    type: TEXT,
    allowNull: false,
    comment: 'query to reach DOM element',
  })
  price_dom_query: string;

  @Column({
    type: TEXT,
    allowNull: false,
    comment: 'query to reach Stock DOM element',
  })
  stock_dom_query: string;

  @Column({
    type: TEXT,
    allowNull: false,
    comment: 'query to reach Pattern of stock',
  })
  stock_pattern: string;

  // @BelongsTo(() => DOM_Query)
  // dom_query: DOM_Query;

  // @ForeignKey(() => DOM_Query)
  // dom_query_id: number;

  @Column({
    type: TEXT,
    allowNull: false,
  })
  domain: string;

  @Column({
    type: TEXT,
    allowNull: false,
  })
  base_url: string;

  @Column({
    type: BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  jsRendering: boolean;

  @Column({
    type: BOOLEAN,
    defaultValue: true,
    allowNull: false,
  })
  is_active: boolean;

  @HasMany(() => DOM_Query)
  dom_queries: DOM_Query[];

  @HasMany(() => ProductCompetitor)
  product_competitors: ProductCompetitor[];

  @HasMany(() => CompetitorIndex)
  competitor_indices: CompetitorIndex[];

  @Column({ type: DATE, allowNull: false })
  created_at: Date;

  @Column({ type: DATE, allowNull: false })
  updated_at: Date;

  @Column({ type: DATE })
  deleted_at: Date;
}
