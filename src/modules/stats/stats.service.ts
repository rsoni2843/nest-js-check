import { Injectable } from '@nestjs/common';
import { Op, Sequelize } from 'sequelize';
import { Brand } from 'src/database/entities/brand.entity';
import { Category } from 'src/database/entities/category.entity';
import { CompetitorIndex } from 'src/database/entities/competitor-index';
import { Configuration } from 'src/database/entities/configuration.entity';
import { DentalkartIndex } from 'src/database/entities/dentalkart-index.entity';
import {
  PricingLog,
  status_enum,
} from 'src/database/entities/pricing-log.entity';
import { ProductCategory } from 'src/database/entities/product-category';
import { ProductCompetitor } from 'src/database/entities/product-competitor.entity';
import { ProductPricingLog } from 'src/database/entities/product-pricing-log.entity';
import {
  Product,
  marketPositionType,
} from 'src/database/entities/product.entity';

interface Row {
  market_position: marketPositionType;
  count: number;
  percentage: number;
}

@Injectable()
export class StatsService {
  async getTrackingSummary() {
    const brandCount = await Brand.count();
    const competitorCount = await Configuration.count();
    const productCount = await Product.count();

    return { brandCount, competitorCount, productCount };
  }

  async getMarketStats() {
    const [result] = await Product.sequelize.query(
      `SELECT 
            market_position,
            COUNT(*) AS count,
            CAST(COUNT(*) * 100 / (SELECT COUNT(*) FROM product WHERE market_position IS NOT NULL AND deleted_at IS NULL) As DECIMAL(5,2)) AS percentage
          FROM product
          WHERE market_position IS NOT NULL AND deleted_at IS NULL
          GROUP BY market_position WITH ROLLUP`,
    );

    const stats = {};
    let totalCount = 0;

    for (const row of result as Row[]) {
      if (row.market_position) {
        stats[row.market_position] = {
          count: row.count,
          percentage: row.percentage,
        };
        totalCount += row.count;
      }
    }

    return { stats, totalCount };
  }

  async getCurrentIndex() {
    const index = await DentalkartIndex.findOne({
      order: [['found_at', 'DESC']],
      limit: 1,
    });
    return index || null;
  }

  async getCompetitorHistoricalIndex(
    range: number,
    startDate: Date,
    endDate: Date,
  ) {
    const list = await CompetitorIndex.findAll({
      include: [{ model: Configuration, attributes: ['domain'], where: {} }],
      where: {
        found_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['found_at', 'ASC']],
    });

    const data = list.reduce((acc, item) => {
      if (!acc[item.configuration.domain]) {
        acc[item.configuration.domain] = [];
      }
      acc[item.configuration.domain].push({
        index: item.index,
        found_at: item.found_at,
      });
      return acc;
    }, {});

    return data;
  }

  async getCompetitorIndex(range: number, startDate: Date, endDate: Date) {
    // const data: { index: number; domain: string; count: number }[] = [];
    const competitorList = await Configuration.findAll({
      attributes: ['domain'],
    });
    const competitorCount = await ProductCompetitor.count({
      group: ['domain'],
    });

    let competitorCountObj = {};
    let data = [];

    for (let comp of competitorList) {
      competitorCountObj[comp.domain as string] = 0;
    }

    for (let comp of competitorCount) {
      competitorCountObj[comp.domain as string] = comp.count;
    }

    const competitors = await Configuration.findAndCountAll({
      attributes: ['id', 'domain'],
      group: ['domain'],
    });

    for (let comp of competitors.rows) {
      let info = await CompetitorIndex.findOne({
        order: [['found_at', 'DESC']],
        include: [{ model: Configuration, attributes: ['domain'] }],
        where: {
          configuration_id: comp.id,
        },
      });

      if (info?.configuration) {
        data.push({
          domain: info.configuration.domain,
          index: info.index,
          count: competitorCountObj[info.configuration.domain],
        });
      }
    }

    const presentDomains = competitorList.reduce((acc, item) => {
      acc[item.domain] = false;
      return acc;
    }, {});

    for (let item of data) {
      presentDomains[item.domain] = true;
    }

    for (let domain in presentDomains) {
      if (!presentDomains[domain]) {
        data.push({
          domain: domain,
          index: 0,
          count: 0,
        });
      }
    }
    return data;
  }

  async getDentalkartHistoricalIndex(
    range: number,
    startDate: Date,
    endDate: Date,
  ) {
    const dentalkartIndexHistory = await DentalkartIndex.findAll({
      where: {
        found_at: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['found_at', 'ASC']],
    });

    return dentalkartIndexHistory;
  }

  async getPriceVariation(start: Date, end: Date, getDbResult?: boolean) {
    const logs = await ProductPricingLog.findAll({
      attributes: [
        'product_id',
        [
          Sequelize.fn(
            'SUM',
            Sequelize.literal(
              'CASE WHEN price_after > price_before THEN true ELSE false END',
            ),
          ),
          'price_increase',
        ],
        [
          Sequelize.fn(
            'SUM',
            Sequelize.literal(
              'CASE WHEN price_after < price_before THEN true ELSE false END',
            ),
          ),
          'price_decrease',
        ],
      ],
      include: [
        { model: Product, attributes: [], where: { deleted_at: null } },
      ],
      group: ['product_id'],
      where: {
        found_at: {
          [Op.between]: [start, end],
        },
      },
    });

    if (getDbResult) return logs;

    const data = logs.reduce(
      (acc, item: any) => {
        if (item.dataValues['price_decrease'] != '0') {
          acc = { ...acc, decrease_count: acc.decrease_count + 1 };
        }
        if (item.dataValues['price_increase'] != '0') {
          acc = { ...acc, increase_count: acc.increase_count + 1 };
        }

        return acc;
      },
      {
        increase_count: 0,
        decrease_count: 0,
      },
    );
    return data;
  }

  async getOutOfStockInfo() {
    const dentalkart = await Product.count({
      where: {
        in_stock: false,
      },
    });

    const competitor = await ProductCompetitor.count({
      where: {
        in_stock: false,
      },
    });

    return { dentalkart, competitor };
  }
}
