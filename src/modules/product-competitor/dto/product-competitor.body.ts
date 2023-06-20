import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';
export class ProductCompetitorCreateArgs {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  competitor_url: string;

  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @IsOptional()
  @IsBoolean()
  in_stock?: boolean;

  @IsNotEmpty()
  @IsBoolean()
  is_grouped: boolean;

  @IsOptional()
  price_query?: boolean;

  @IsOptional()
  stock_query?: boolean;

  @IsOptional()
  stock_pattern?: boolean;
}

export class ProductCompetitorUpdateArgs {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUrl()
  competitor_url?: string;

  @IsOptional()
  @IsNumber()
  product_id?: number;

  @IsOptional()
  @IsBoolean()
  in_stock?: boolean;

  @IsOptional()
  price_query?: boolean;

  @IsOptional()
  stock_query?: boolean;

  @IsOptional()
  stock_pattern?: boolean;
}
