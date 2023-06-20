import { IsAlpha, IsNotEmpty, IsOptional } from 'class-validator';

export class BrandArgs {
  @IsNotEmpty()
  name: string;
}
