import { Sequelize } from 'sequelize-typescript';

import env from 'src/config/env';
import { Category } from './entities/category.entity';
import { PricingLog } from './entities/pricing-log.entity';
import { Product } from './entities/product.entity';
import { Configuration } from './entities/configuration.entity';
import { ProductCompetitor } from './entities/product-competitor.entity';
import { ProductCategory } from './entities/product-category';
import { ProcessingLog } from './entities/processing-logs';
import { UploadLog } from './entities/upload-log';
import { DentalkartIndex } from './entities/dentalkart-index.entity';
import { ProductPricingLog } from './entities/product-pricing-log.entity';
import { CompetitorIndex } from './entities/competitor-index';
import { Brand } from './entities/brand.entity';
import { User } from './entities/user.entity';
import { ReportFiles } from './entities/report-files.entity';
import { DOM_Query } from './entities/dom_query.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async () => {
      const sequelize = new Sequelize({
        ...(env.database as any),
        logging: false,
        models: [
          Category,
          ProductCompetitor,
          Product,
          ProductCategory,
          Configuration,
          PricingLog,
          ProcessingLog,
          UploadLog,
          DentalkartIndex,
          ProductPricingLog,
          CompetitorIndex,
          Brand,
          User,
          ReportFiles,
          DOM_Query,
        ],
      });

      return sequelize;
    },
  },
];
