import { ProcessFileArgs } from './dto/batch-import.args';
import { ProductsService } from '../products/products.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { S3Service } from '../../utils/s3-service';
export declare class BatchImportService {
    private ProductsService;
    private ProductCompetitorService;
    private S3Service;
    constructor(ProductsService: ProductsService, ProductCompetitorService: ProductCompetitorService, S3Service: S3Service);
    preProcess(data: ProcessFileArgs): Promise<{
        headers: string[];
        csvData: any[];
        uploadedFileURL: string;
    }>;
    test(filename: string): Promise<void>;
    processFile(csvData: any[], headers: string[], columnMapping: {
        [key: string]: string;
    }, uploadedFileURL: string, competitorPattern: string): Promise<void>;
    private saveCsvFile;
}
