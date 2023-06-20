import {
  IsAlpha,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class ConfigurationCreateArgs {
  @IsNotEmpty()
  dom_query: string;

  @IsNotEmpty()
  stock_dom_query: string;

  @IsOptional()
  stock_pattern: string;

  @IsNotEmpty()
  @IsUrl()
  base_url: string;

  @IsOptional()
  @IsBoolean()
  jsRendering: boolean;
}

export class ConfigurationUpdateArgs {
  @IsOptional()
  dom_query?: string;

  @IsOptional()
  @IsUrl()
  base_url?: string;

  @IsOptional()
  @IsBoolean()
  jsRendering: boolean;

  @IsOptional()
  stock_dom_query: string;

  @IsOptional()
  stock_pattern: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
