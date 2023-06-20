import { IsNotEmpty, IsOptional } from 'class-validator';

export class ProcessFileArgs {
  @IsOptional()
  competitorPattern: string;

  @IsNotEmpty()
  columnMapping: { [key: string]: string };

  @IsNotEmpty()
  filename: string;
}
