import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';
export class ProductCreateArgs {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  base_price?: number;

  @IsNotEmpty()
  product_code: string;

  @IsOptional()
  @IsNumber()
  bar_code?: number;

  @IsOptional()
  description?: string;

  @IsNotEmpty()
  @IsUrl()
  product_url: string;

  @IsNotEmpty()
  brand_id: number;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsBoolean()
  in_stock?: boolean;
}

export class ProductUpdateArgs {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsPositive()
  base_price?: number;

  @IsOptional()
  product_code?: string;

  @IsOptional()
  @IsNumber()
  bar_code?: number;

  @IsOptional()
  description?: string;

  @IsOptional()
  brand_id?: number;

  @IsOptional()
  @IsUrl()
  product_url?: string;

  @IsOptional()
  @IsBoolean()
  in_stock?: boolean;

  @IsOptional()
  @IsNumber()
  category_id?: number;
}
