import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare enum sorting_order {
    DESC = "desc",
    ASC = "asc"
}
export type sorting_order_type = sorting_order | undefined;
export declare class ParseQueryPipe implements PipeTransform {
    private readonly defaultValue;
    constructor(defaultValue?: number);
    transform(value: any, metadata: ArgumentMetadata): number;
}
export declare class ParseSortingPipe implements PipeTransform {
    constructor();
    transform(value: any, metadata: ArgumentMetadata): sorting_order;
}
export declare class DateFormatConversionPipe implements PipeTransform {
    private readonly type;
    constructor(type: string);
    transform(value: string, metadata: ArgumentMetadata): Date;
}
export declare class ParseEnumPipe implements PipeTransform {
    private possibleValues;
    constructor(possibleValues: string[]);
    transform(value: any, metadata: ArgumentMetadata): any;
}
export declare class ParseArrayPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): number[];
}
