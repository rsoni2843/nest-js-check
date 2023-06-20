import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import env from 'src/config/env';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucketName: string;
  constructor() {
    this.s3 = new S3({
      credentials: {
        accessKeyId: env.aws.access_key_id,
        secretAccessKey: env.aws.secret_access_key,
      },
    });
    this.bucketName = env.aws.bucket_name;
  }

  async uploadFileToS3(
    fileName: string,
    fileStream: NodeJS.ReadableStream,
  ): Promise<string> {
    const uploadParams = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: fileStream,
      ACL: 'public-read',
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(uploadParams, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location);
        }
      });
    });
  }
}
