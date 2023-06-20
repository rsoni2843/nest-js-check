import { IsAlpha, IsNotEmpty, IsOptional } from 'class-validator';

export class CategoryArgs {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description: string;
}
