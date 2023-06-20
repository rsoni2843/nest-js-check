/// <reference types="node" />
export declare class S3Service {
    private s3;
    private bucketName;
    constructor();
    uploadFileToS3(fileName: string, fileStream: NodeJS.ReadableStream): Promise<string>;
}
