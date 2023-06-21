import { sorting_order } from 'src/pipes/query-params.pipe';
export type sorting_keys = 'base_price' | 'price' | 'product_code' | 'name' | 'competitor_count' | 'created_at';
type product_sorting_order = {
    [key in sorting_keys]: sorting_order;
};
export default product_sorting_order;
