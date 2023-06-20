import { status_enum } from 'src/database/entities/pricing-log.entity';

export interface addEntryInterface {
  product_id?: number;
  product_competitor_id?: number;
  price_before: number;
  price_after: number;
  dom_query?: string;
  status: status_enum;
  index?: number;
}
