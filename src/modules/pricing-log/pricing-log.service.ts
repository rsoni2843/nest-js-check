import { Injectable } from '@nestjs/common';
import { addEntryInterface } from './dto/add-entry';
import { PricingLog } from 'src/database/entities/pricing-log.entity';
import { ProductPricingLog } from 'src/database/entities/product-pricing-log.entity';
import { ProductCompetitor } from 'src/database/entities/product-competitor.entity';
import { Product } from 'src/database/entities/product.entity';

@Injectable()
export class PricingLogService {
  async addCompetitorEntry(data: addEntryInterface) {
    await PricingLog.create({
      product_competitor_id: data.product_competitor_id,
      price_before: data.price_before,
      price_after: data.price_after,
      dom_query: data.dom_query,
      index: data.index,
      status: data.status,
    });
  }

  async addProductEntry(data: addEntryInterface) {
    await ProductPricingLog.create({
      product_id: data.product_id,
      price_before: data.price_before,
      price_after: data.price_after,
      status: data.status,
    });
  }

  async getCompetitorLogs(
    page: number,
    size: number,
    productCompetitorId: number,
  ) {
    const list = await PricingLog.findAndCountAll({
      where: { product_competitor_id: productCompetitorId },
      limit: size,
      offset: page * size,
      order: [['found_at', 'DESC']],
    });

    return {
      data: list.rows,
      page: page,
      totalPages: Math.ceil(list.count / Number(size)),
    };
  }

  async getProductLogs(page: number, size: number, productId: number) {
    const list = await ProductPricingLog.findAndCountAll({
      where: { product_id: productId },
      limit: size,
      offset: page * size,
      order: [['found_at', 'DESC']],
    });

    return {
      data: list.rows,
      page: page,
      totalPages: Math.ceil(list.count / Number(size)),
    };
  }

  async getConfigurationWiseLogs(
    page: number,
    size: number,
    productId: number,
  ) {
    const list = await PricingLog.findAndCountAll({
      attributes: {
        exclude: ['dom_query', 'product_competitor_id', 'index'],
      },
      include: [
        {
          model: ProductCompetitor,
          attributes: ['domain'],
          where: { product_id: productId },
        },
      ],
      limit: size,
      offset: page * size,
      order: [['found_at', 'DESC']],
    });

    return {
      data: list.rows,
      page: page,
      totalPages: Math.ceil(list.count / Number(size)),
    };
  }
}
