"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchImportService = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const common_1 = require("@nestjs/common");
const products_service_1 = require("../products/products.service");
const product_entity_1 = require("../../database/entities/product.entity");
const upload_log_1 = require("../../database/entities/upload-log");
const processing_logs_1 = require("../../database/entities/processing-logs");
const category_entity_1 = require("../../database/entities/category.entity");
const product_competitor_service_1 = require("../product-competitor/product-competitor.service");
const s3_service_1 = require("../../utils/s3-service");
const domain_helper_1 = require("../../utils/domain-helper");
const brand_entity_1 = require("../../database/entities/brand.entity");
const path_1 = __importDefault(require("path"));
const date_helper_1 = require("../../utils/date-helper");
var col_enum;
(function (col_enum) {
    col_enum["Name"] = "Name";
    col_enum["Product_Code"] = "Product Code";
    col_enum["Barcode"] = "Barcode";
    col_enum["Price"] = "Price";
    col_enum["Category"] = "Category";
    col_enum["Dentalkart_URL"] = "Dentalkart's URL";
    col_enum["Brand"] = "Brand";
})(col_enum || (col_enum = {}));
const dentalkart_url_pattern = new RegExp(`^(https?:\\/\\/)?(www\\.)?${'dentalkart.com'}\\/`, 'i');
const ACCEPTED_HEADERS = Object.values(col_enum);
const REQUIRED_HEADERS = ACCEPTED_HEADERS.filter((header) => header != col_enum.Category && header != col_enum.Barcode);
let BatchImportService = class BatchImportService {
    constructor(ProductsService, ProductCompetitorService, S3Service) {
        this.ProductsService = ProductsService;
        this.ProductCompetitorService = ProductCompetitorService;
        this.S3Service = S3Service;
    }
    async preProcess(data) {
        const filePath = `./uploads/${data.filename}`;
        const fileExists = await (async () => {
            try {
                await fs_1.default.promises.access(filePath, fs_1.default.constants.F_OK);
                return true;
            }
            catch (error) {
                return false;
            }
        })();
        if (!fileExists) {
            throw new common_1.BadRequestException('unable to process the file');
        }
        const readStream = fs_1.default.createReadStream(filePath);
        const uploadedFileURL = await this.S3Service.uploadFileToS3(`results/result_${Date.now()}.csv`, readStream);
        readStream.destroy();
        function getFields() {
            return new Promise(async (resolve) => {
                let results = [];
                let csvData = [];
                fs_1.default.createReadStream(filePath)
                    .pipe((0, csv_parser_1.default)())
                    .on('headers', (headers) => {
                    headers.forEach(function (element) {
                        results.push(element);
                    });
                })
                    .on('data', (data) => {
                    csvData.push(data);
                })
                    .on('end', () => {
                    resolve({ headers: results, csvData });
                });
            });
        }
        const { headers, csvData } = await getFields();
        if (headers.length < REQUIRED_HEADERS.length)
            throw new common_1.BadRequestException('unable to process uploaded file as it contains less columns than required');
        for (let column of REQUIRED_HEADERS) {
            if (!data.columnMapping[column]) {
                throw new common_1.BadRequestException(`column '${column}' is not mapped`);
            }
            else if (!headers.includes(data.columnMapping[column])) {
                throw new common_1.BadRequestException(`column '${column}' is mapped incorrectly to ${data.columnMapping[column]}`);
            }
        }
        let isCompetitorColumnExisting = false;
        if (data.competitorPattern) {
            for (let col of headers) {
                if (col.includes(data.competitorPattern)) {
                    isCompetitorColumnExisting = true;
                    break;
                }
            }
            if (!isCompetitorColumnExisting) {
                throw new common_1.BadRequestException(`there exist no column which matches ${data.competitorPattern} pattern`);
            }
        }
        return { headers, csvData, uploadedFileURL };
    }
    async test(filename) {
        const stream = fs_1.default.createReadStream(`./uploads/${filename}`);
    }
    async processFile(csvData, headers, columnMapping, uploadedFileURL, competitorPattern) {
        const uploadLog = await upload_log_1.UploadLog.create({
            uploaded_file: uploadedFileURL,
        });
        const processedData = [];
        const errorCountOfDomain = {};
        const competitorColumns = headers.filter((col) => col.includes(competitorPattern));
        const insertProduct = async (row) => {
            let errorInRow = false;
            let category = undefined;
            let brand = undefined;
            if (!dentalkart_url_pattern.test(row[columnMapping[col_enum.Dentalkart_URL]])) {
                if (!errorInRow) {
                    errorInRow = true;
                }
            }
            if (errorInRow)
                throw new Error('product URL does not belongs to dentalkart');
            if (row[columnMapping[col_enum.Category]]) {
                [category] = await category_entity_1.Category.findOrCreate({
                    where: { title: row[columnMapping[col_enum.Category]].trim() },
                    defaults: { title: row[columnMapping[col_enum.Category]].trim() },
                });
            }
            [brand] = await brand_entity_1.Brand.findOrCreate({
                where: { name: row[columnMapping[col_enum.Brand]].trim() },
                defaults: { name: row[columnMapping[col_enum.Brand]].trim() },
            });
            console.log(`adding product with product code : ${row[columnMapping[col_enum.Product_Code]]}`);
            const product = await this.ProductsService.create({
                product_url: row[columnMapping[col_enum.Dentalkart_URL]].trim(),
                name: row[columnMapping[col_enum.Name]],
                base_price: Number(row[columnMapping[col_enum.Price]]),
                product_code: row[columnMapping[col_enum.Product_Code]].trim(),
                category_id: category === null || category === void 0 ? void 0 : category.id,
                brand_id: brand === null || brand === void 0 ? void 0 : brand.id,
            });
            console.log(`${product.product_code} added`);
            return product;
        };
        const insertCompetitor = async (row, product) => {
            const messages = [];
            for (let competitor of competitorColumns) {
                if (!row[competitor]) {
                    messages.push('-');
                    continue;
                }
                try {
                    if (errorCountOfDomain[(0, domain_helper_1.getDomain)(row[competitor])] > 2)
                        throw new Error(`unable to get price from ${(0, domain_helper_1.getDomain)(row[competitor])}`);
                    console.log(`adding competitor for product code : ${product.product_code}, and domain : ${(0, domain_helper_1.getDomain)(row[competitor])}`);
                    await this.ProductCompetitorService.create({
                        competitor_url: row[competitor],
                        product_id: product.id,
                        name: product.name,
                        is_grouped: false,
                    });
                    messages.push('added');
                }
                catch (error) {
                    if (!errorCountOfDomain[(0, domain_helper_1.getDomain)(row[competitor])])
                        errorCountOfDomain[(0, domain_helper_1.getDomain)(row[competitor])] = 1;
                    else
                        errorCountOfDomain[(0, domain_helper_1.getDomain)(row[competitor])]++;
                    messages.push(`${row[competitor]} : ${error.message}`);
                }
            }
            return messages;
        };
        for (const [index, row] of csvData.entries()) {
            const productCode = row[columnMapping[col_enum.Product_Code]].trim();
            let existingProduct = await product_entity_1.Product.findOne({
                where: { product_code: productCode },
            });
            const [processingLog] = await processing_logs_1.ProcessingLog.findOrCreate({
                where: {
                    product_code: productCode,
                    upload_log_id: uploadLog.id,
                },
                defaults: {
                    product_code: productCode,
                    status: processing_logs_1.processing_status.SUCCESS,
                    upload_log_id: uploadLog.id,
                    message: '',
                },
            });
            try {
                const product = existingProduct
                    ? existingProduct
                    : await insertProduct(row);
                const competitorMessages = competitorPattern
                    ? await insertCompetitor(row, product)
                    : [];
                processedData.push({
                    product_url: row[columnMapping[col_enum.Dentalkart_URL]],
                    product_code: productCode,
                    status: existingProduct ? 'already exist' : processing_logs_1.processing_status.SUCCESS,
                    message: competitorMessages,
                });
            }
            catch (error) {
                console.log(error);
                processedData.push({
                    product_url: row[columnMapping[col_enum.Dentalkart_URL]],
                    product_code: productCode,
                    status: error.message,
                    message: competitorColumns.map((m) => '-'),
                });
                processingLog.set(Object.assign(Object.assign({}, processingLog), { status: processing_logs_1.processing_status.FAILURE, message: error.message }));
            }
            await processingLog.save();
            if (index == csvData.length - 1) {
            }
        }
        try {
            const filename = `${(0, date_helper_1.formatDateString)(new Date())}.csv`;
            const reportFileName = await this.saveCsvFile(processedData, competitorColumns, filename);
            const reportReadStream = fs_1.default.createReadStream(path_1.default.resolve('reports', reportFileName));
            const reportFileURL = await this.S3Service.uploadFileToS3(reportFileName, reportReadStream);
            console.log('report file url', reportFileURL);
            uploadLog.set(Object.assign(Object.assign({}, uploadLog), { report_file: reportFileURL, filename: reportFileName }));
            await uploadLog.save();
            fs_1.default.unlink(path_1.default.resolve('reports', filename), (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log('temporary report file deleted successfully!');
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    saveCsvFile(data, competitors, filename) {
        const directoryPath = path_1.default.resolve('reports');
        if (!fs_1.default.existsSync(directoryPath)) {
            fs_1.default.mkdirSync(directoryPath, { recursive: true });
        }
        const stream = fs_1.default.createWriteStream(path_1.default.resolve('reports', filename));
        stream.write(`Product Code,URL,Status,${competitors.join(',')}\n`);
        for (let row of data) {
            stream.write(`${row.product_code},${row.product_url},${row.status},${row.message.join(',')}\n`);
        }
        return new Promise((resolve, reject) => {
            stream.on('finish', () => {
                resolve(filename);
            });
            stream.on('error', (error) => {
                reject(error);
            });
            stream.end();
        });
    }
};
BatchImportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [products_service_1.ProductsService,
        product_competitor_service_1.ProductCompetitorService,
        s3_service_1.S3Service])
], BatchImportService);
exports.BatchImportService = BatchImportService;
//# sourceMappingURL=batch-import.service.js.map