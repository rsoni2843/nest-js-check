import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { format, parse, subDays } from 'date-fns';

export enum sorting_order {
  DESC = 'desc',
  ASC = 'asc',
}
export type sorting_order_type = sorting_order | undefined;

@Injectable()
export class ParseQueryPipe implements PipeTransform {
  constructor(private readonly defaultValue: number = 0) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    return isNaN(val) ? this.defaultValue : val;
  }
}

@Injectable()
export class ParseSortingPipe implements PipeTransform {
  constructor() {}

  //this checks whether or not correct sorting order is passed
  // if not undefined is passed that will not take part in the sorting
  transform(value: any, metadata: ArgumentMetadata) {
    if (value === sorting_order.DESC) return sorting_order.DESC;
    else if (value === sorting_order.ASC) return sorting_order.ASC;
    else return undefined;
  }
}

@Injectable()
export class DateFormatConversionPipe implements PipeTransform {
  constructor(private readonly type: string) {}

  transform(value: string, metadata: ArgumentMetadata): Date {
    if ((value === undefined || value == '') && this.type == 'startDate') {
      const parsedDate = format(
        subDays(new Date(), 100),
        'yyyy-MM-dd HH:mm:ss',
      );
      const startDate = parse(parsedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
      return startDate;
    } else if ((value === undefined || value == '') && this.type == 'endDate') {
      const parsedDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const endDate = parse(parsedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
      return endDate;
    } else {
      const setDate = format(new Date(value), 'yyyy-MM-dd HH:mm:ss');
      const parsedDate = parse(setDate, 'yyyy-MM-dd HH:mm:ss', new Date());
      if (!parsedDate) {
        throw new BadRequestException('Yo !! Invalid date format');
      }
      return parsedDate;
    }
  }
}

@Injectable()
export class ParseEnumPipe implements PipeTransform {
  constructor(private possibleValues: string[]) {}

  //it only allows possible values to pass through
  transform(value: any, metadata: ArgumentMetadata) {
    if (this.possibleValues.indexOf(value) != -1) return value;
    else return undefined;
  }
}

@Injectable()
export class ParseArrayPipe implements PipeTransform {
  //it only allows numeric array values to pass through
  transform(value: any, metadata: ArgumentMetadata) {
    if (Array.isArray(value)) return value.map((v) => +v);
    else return undefined;
  }
}
