import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { Configuration } from '../../database/entities/configuration.entity';
import {
  ConfigurationCreateArgs,
  ConfigurationUpdateArgs,
} from './dto/configuration.dto';
import { getDomain } from '../../utils/domain-helper';
import { ProductCompetitor } from '../../database/entities/product-competitor.entity';
import { Op, Sequelize } from 'sequelize';
import { Product } from 'src/database/entities/product.entity';
import { DOM_Query, query_type } from 'src/database/entities/dom_query.entity';

@Injectable()
export class ConfigurationService {
  async create(data: ConfigurationCreateArgs) {
    const domain = getDomain(data.base_url);

    if (!domain) throw new BadGatewayException('invalid url');

    const existingConfiguration = await this.getByDomain(domain);

    if (existingConfiguration)
      throw new BadGatewayException(
        'configuration with this domain already exists!',
      );

    const configuration = await Configuration.create({
      base_url: data.base_url,
      domain: domain,
      price_dom_query: data.dom_query,
      stock_dom_query: data.stock_dom_query,
      stock_pattern: data.stock_pattern.trim(),
      jsRendering: data.jsRendering || false,
    });

    const query = await DOM_Query.create({
      price_query: data.dom_query,
      stock_query: data.stock_dom_query,
      stock_pattern: data.stock_pattern.trim(),
      query_type: query_type.DEFAULT,
      configuration_id: configuration.id,
    });

    return configuration;
  }

  async completeListForScraping() {
    return await Configuration.findAll();
  }

  async get(id: number) {
    const configuration = await Configuration.findByPk(id);

    if (!configuration)
      throw new BadRequestException('unable to get configuration');

    return configuration;
  }

  async update(id: number, data: ConfigurationUpdateArgs) {
    const configuration = await this.get(id);

    configuration.set({
      ...data,
    });

    if (data?.base_url) {
      const newDomain = getDomain(data.base_url);

      const query = await DOM_Query.findOne({
        where: {
          configuration_id: configuration.id,
          query_type: query_type.DEFAULT,
        },
      });

      // const query = await DOM_Query.findByPk(configuration.dom_query_id);
      let hasQueryUpdated = false;
      if (data.dom_query && data.dom_query != query.price_query) {
        query.set({ price_query: data.dom_query });
        hasQueryUpdated = true;
      }

      if (data.stock_dom_query && data.stock_dom_query != query.stock_query) {
        query.set({ stock_query: data.stock_dom_query });
        hasQueryUpdated = true;
      }

      if (data.stock_pattern && data.stock_pattern != query.stock_pattern) {
        query.set({ stock_pattern: data.stock_pattern.trim() });
        hasQueryUpdated = true;
      }

      hasQueryUpdated && (await query.save());
      configuration.set({
        domain: newDomain,
        base_url: data.base_url,
        price_dom_query: query.price_query,
        stock_dom_query: query.stock_query,
        stock_pattern: query.stock_pattern.trim(),
      });
    }

    await configuration.save();

    return configuration;
  }

  async list(page: number, size: number, includeCompetitorCount: boolean) {
    const count = await Configuration.count();

    const attributes: any[] = [
      'id',
      'domain',
      'base_url',
      'is_active',
      'created_at',
      'updated_at',
    ];

    if (includeCompetitorCount)
      attributes.push([
        Sequelize.fn('COUNT', Sequelize.col('product_competitors.id')),
        'competitor_count',
      ]);

    const configurationList = await Configuration.findAll({
      attributes: attributes,

      include: [
        {
          model: ProductCompetitor,
          attributes: [],
          include: [
            {
              model: Product,
              where: { deleted_at: null },
            },
          ],
        },
      ],
      group: ['id'],
      order: [['created_at', 'DESC']],
      // limit: size,
      offset: page * size,
    });
    return {
      data: configurationList.slice(
        0,
        size > configurationList.length ? configurationList.length : size,
      ),
      totalPages: Math.ceil(count / Number(size)),
    };
  }

  async remove(id: number) {
    const config = await this.get(id);

    const competitors = await ProductCompetitor.findAll({
      where: { configuration_id: config.id },
    });

    for (let comp of competitors) {
      await comp.destroy({ force: true });
    }

    await config.destroy();
  }

  async getByDomain(domain: string) {
    const configuration = await Configuration.findOne({
      where: {
        domain: domain,
      },
      include: [{ model: DOM_Query }],
    });

    return configuration;
  }

  async getConfigurationsFromIdArray(idArray: number[]) {
    const configurations = await Configuration.findAll({
      attributes: ['id', 'domain'],
      where: {
        id: {
          [Op.in]: idArray,
        },
      },
    });

    return configurations.map((b) => b.domain).join(' ');
  }
}
