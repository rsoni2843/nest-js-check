import fs from 'fs';
import csvParser from 'csv-parser';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ProcessFileArgs } from './dto/batch-import.args';
import { ProductsService } from '../products/products.service';
import { Product } from 'src/database/entities/product.entity';
import { UploadLog } from 'src/database/entities/upload-log';
import {
  ProcessingLog,
  processing_status,
} from 'src/database/entities/processing-logs';
import { Category } from 'src/database/entities/category.entity';
import { Configuration } from 'src/database/entities/configuration.entity';
import { ConfigurationService } from '../configuration/configuration.service';
import { ProductCompetitorService } from '../product-competitor/product-competitor.service';
import { S3Service } from '../../utils/s3-service';
import { getDomain } from 'src/utils/domain-helper';
import { Brand } from 'src/database/entities/brand.entity';
import path from 'path';
import { formatDateString } from 'src/utils/date-helper';

enum col_enum {
  Name = 'Name',
  Product_Code = 'Product Code',
  Barcode = 'Barcode',
  Price = 'Price',
  Category = 'Category',
  Dentalkart_URL = `Dentalkart's URL`,
  Brand = 'Brand',
}
type reportFileType = {
  product_url: string;
  product_code: string;
  status: string;
  message: string[];
};
const dentalkart_url_pattern = new RegExp(
  `^(https?:\\/\\/)?(www\\.)?${'dentalkart.com'}\\/`,
  'i',
);
const ACCEPTED_HEADERS = Object.values(col_enum);
const REQUIRED_HEADERS = ACCEPTED_HEADERS.filter(
  (header) => header != col_enum.Category && header != col_enum.Barcode,
);

@Injectable()
export class BatchImportService {
  constructor(
    private ProductsService: ProductsService,
    private ProductCompetitorService: ProductCompetitorService,
    private S3Service: S3Service,
  ) {}
  async preProcess(data: ProcessFileArgs) {
    const filePath = `./uploads/${data.filename}`;
    const fileExists = await (async () => {
      try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return true;
      } catch (error) {
        return false;
      }
    })();

    if (!fileExists) {
      throw new BadRequestException('unable to process the file');
    }

    const readStream = fs.createReadStream(filePath);
    const uploadedFileURL = await this.S3Service.uploadFileToS3(
      `results/result_${Date.now()}.csv`,
      readStream,
    );
    readStream.destroy();

    function getFields(): Promise<{ headers: string[]; csvData: any[] }> {
      // readStream: NodeJS.ReadableStream,
      return new Promise(async (resolve) => {
        let results = [];
        let csvData = [];
        fs.createReadStream(filePath)
          .pipe(csvParser())
          .on('headers', (headers) => {
            headers.forEach(function (element) {
              results.push(element);
            });
            // console.log('I am actually getting results here: ', results);
            // resolve(results);
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
      throw new BadRequestException(
        'unable to process uploaded file as it contains less columns than required',
      );

    //checking for valid columns
    for (let column of REQUIRED_HEADERS) {
      if (!data.columnMapping[column]) {
        throw new BadRequestException(`column '${column}' is not mapped`);
      }
      //mapping has some value
      else if (!headers.includes(data.columnMapping[column])) {
        throw new BadRequestException(
          `column '${column}' is mapped incorrectly to ${data.columnMapping[column]}`,
        );
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
        throw new BadRequestException(
          `there exist no column which matches ${data.competitorPattern} pattern`,
        );
      }
    }

    return { headers, csvData, uploadedFileURL };
  }

  async test(filename: string) {
    const stream = fs.createReadStream(`./uploads/${filename}`);
    // return await this.S3Service.uploadFileToS3(filename, stream);
  }
  async processFile(
    csvData: any[],
    headers: string[],
    columnMapping: { [key: string]: string },
    uploadedFileURL: string,
    competitorPattern: string,
  ) {
    const uploadLog = await UploadLog.create({
      uploaded_file: uploadedFileURL,
    });

    const processedData: reportFileType[] = [];
    const errorCountOfDomain: any = {}; //for blacklisting domain throughout addittion
    const competitorColumns = headers.filter((col) =>
      col.includes(competitorPattern),
    );
    const insertProduct = async (row: any) => {
      let errorInRow = false;
      let category = undefined;
      let brand = undefined;
      /** Checking for errors **/
      //checking if the url belongs to dentalkart
      if (
        !dentalkart_url_pattern.test(
          row[columnMapping[col_enum.Dentalkart_URL]],
        )
      ) {
        if (!errorInRow) {
          errorInRow = true;
        }
      }

      if (errorInRow)
        throw new Error('product URL does not belongs to dentalkart');

      if (row[columnMapping[col_enum.Category]]) {
        [category] = await Category.findOrCreate({
          where: { title: row[columnMapping[col_enum.Category]].trim() },
          defaults: { title: row[columnMapping[col_enum.Category]].trim() },
        });
      }
      [brand] = await Brand.findOrCreate({
        where: { name: row[columnMapping[col_enum.Brand]].trim() },
        defaults: { name: row[columnMapping[col_enum.Brand]].trim() },
      });
      console.log(
        `adding product with product code : ${
          row[columnMapping[col_enum.Product_Code]]
        }`,
      );
      const product = await this.ProductsService.create({
        product_url: row[
          columnMapping[col_enum.Dentalkart_URL]
        ].trim() as string,
        name: row[columnMapping[col_enum.Name]] as string,
        base_price: Number(row[columnMapping[col_enum.Price]]),
        product_code: row[columnMapping[col_enum.Product_Code]].trim(),
        category_id: category?.id,
        brand_id: brand?.id,
      });
      console.log(`${product.product_code} added`);
      return product;
    };

    const insertCompetitor = async (row: any, product: Product) => {
      const messages: string[] = [];
      for (let competitor of competitorColumns) {
        if (!row[competitor]) {
          messages.push('-');
          continue;
        }
        try {
          if (errorCountOfDomain[getDomain(row[competitor])] > 2)
            throw new Error(
              `unable to get price from ${getDomain(row[competitor])}`,
            );
          console.log(
            `adding competitor for product code : ${
              product.product_code
            }, and domain : ${getDomain(row[competitor])}`,
          );
          await this.ProductCompetitorService.create({
            competitor_url: row[competitor],
            product_id: product.id,
            name: product.name,
            is_grouped: false, //assuming all batch import products to be individual products
          });
          messages.push('added');
        } catch (error) {
          if (!errorCountOfDomain[getDomain(row[competitor])])
            errorCountOfDomain[getDomain(row[competitor])] = 1;
          else errorCountOfDomain[getDomain(row[competitor])]++;

          messages.push(`${row[competitor]} : ${error.message}`);
        }
      }

      // if (messages.length > 0) {
      //   throw new Error(messages.join(' | '));
      // }
      return messages;
    };

    // const reportFileName = `report_${Date.now()}.csv`;

    for (const [index, row] of csvData.entries()) {
      const productCode = row[columnMapping[col_enum.Product_Code]].trim();
      // const stream = fs.createWriteStream(`./report/${reportFileName}`);
      // stream.write('Product Code,URL,Status,Message\n');

      let existingProduct = await Product.findOne({
        where: { product_code: productCode },
      });

      //creating an entry in processing logs table against product_code
      const [processingLog] = await ProcessingLog.findOrCreate({
        where: {
          product_code: productCode,
          upload_log_id: uploadLog.id,
        },
        defaults: {
          product_code: productCode,
          status: processing_status.SUCCESS, //assuming it to succeed if it fails we'll make this into failure
          upload_log_id: uploadLog.id,
          message: '',
        },
      });

      try {
        const product = existingProduct
          ? existingProduct
          : await insertProduct(row);

        // if (competitorPattern) await insertCompetitor(row, product);

        const competitorMessages = competitorPattern
          ? await insertCompetitor(row, product)
          : [];
        processedData.push({
          product_url: row[columnMapping[col_enum.Dentalkart_URL]],
          product_code: productCode,
          status: existingProduct ? 'already exist' : processing_status.SUCCESS,
          message: competitorMessages,
        });
      } catch (error) {
        console.log(error);
        processedData.push({
          product_url: row[columnMapping[col_enum.Dentalkart_URL]],
          product_code: productCode,
          status: error.message,
          message: competitorColumns.map((m) => '-'),
        });

        processingLog.set({
          ...processingLog,
          status: processing_status.FAILURE,
          message: error.message,
        });
      }

      //saving
      await processingLog.save();

      //destroying wwrite stream
      if (index == csvData.length - 1) {
        // stream.destroy();
      }
    }

    try {
      //console.log('processedData :', processedData);
      const filename = `${formatDateString(new Date())}.csv`;

      // fs.writeFileSync(path.resolve('reports', filename), 'content');
      const reportFileName = await this.saveCsvFile(
        processedData,
        competitorColumns,
        filename,
      );
      const reportReadStream = fs.createReadStream(
        path.resolve('reports', reportFileName),
      );
      const reportFileURL = await this.S3Service.uploadFileToS3(
        reportFileName,
        reportReadStream,
      );
      console.log('report file url', reportFileURL);
      uploadLog.set({
        ...uploadLog,
        report_file: reportFileURL,
        filename: reportFileName,
      });
      await uploadLog.save();

      //deleting the temp report file
      fs.unlink(path.resolve('reports', filename), (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('temporary report file deleted successfully!');
      });
    } catch (error) {
      console.log(error);
    }
  }

  private saveCsvFile(
    data: reportFileType[],
    competitors: string[],
    filename: string,
  ) {
    // Create a new write stream to the CSV file
    const directoryPath = path.resolve('reports');
    // Check if directory exists, create it if it doesn't
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    const stream = fs.createWriteStream(path.resolve('reports', filename));
    // Write the CSV header

    stream.write(`Product Code,URL,Status,${competitors.join(',')}\n`);

    // Write each row of data to the CSV file
    for (let row of data) {
      stream.write(
        `${row.product_code},${row.product_url},${
          row.status
        },${row.message.join(',')}\n`,
      );
    }

    // Close the write stream
    return new Promise<string>((resolve, reject) => {
      stream.on('finish', () => {
        resolve(filename);
      });

      stream.on('error', (error) => {
        reject(error);
      });

      stream.end();
    });
  }
}
