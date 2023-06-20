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
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const env_1 = __importDefault(require("../config/env"));
let S3Service = class S3Service {
    constructor() {
        this.s3 = new aws_sdk_1.S3({
            credentials: {
                accessKeyId: env_1.default.aws.access_key_id,
                secretAccessKey: env_1.default.aws.secret_access_key,
            },
        });
        this.bucketName = env_1.default.aws.bucket_name;
    }
    async uploadFileToS3(fileName, fileStream) {
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
                }
                else {
                    resolve(data.Location);
                }
            });
        });
    }
};
S3Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], S3Service);
exports.S3Service = S3Service;
//# sourceMappingURL=s3-service.js.map