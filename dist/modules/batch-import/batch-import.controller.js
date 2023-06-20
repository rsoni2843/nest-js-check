"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchImportController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = __importDefault(require("path"));
const batch_import_args_1 = require("./dto/batch-import.args");
const batch_import_service_1 = require("./batch-import.service");
const fs = __importStar(require("fs"));
let BatchImportController = class BatchImportController {
    constructor(BatchImportService) {
        this.BatchImportService = BatchImportService;
    }
    uploadFile(file) {
        return {
            status: 'ok',
            message: 'file uploaded successfully',
            filename: file.filename,
        };
    }
    async test(body) {
        return await this.BatchImportService.test(body.filename);
    }
    async processUploadedFile(res, data) {
        const { csvData, headers, uploadedFileURL } = await this.BatchImportService.preProcess(data);
        res.json({
            message: 'file uploaded successfully',
        });
        await this.BatchImportService.processFile(csvData, headers, data.columnMapping, uploadedFileURL, data.competitorPattern);
        fs.unlink(`./uploads/${data.filename}`, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log('temporary uploaded File deleted successfully!');
        });
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(csv)$/)) {
                return cb(new common_1.BadRequestException('Only CSV files are allowed'), null);
            }
            cb(null, true);
        },
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const filename = path_1.default.parse(file.originalname).name;
                const extension = path_1.default.parse(file.originalname).ext;
                cb(null, `${filename}_${Date.now()}${extension}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], BatchImportController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BatchImportController.prototype, "test", null);
__decorate([
    (0, common_1.Post)('process-file'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, batch_import_args_1.ProcessFileArgs]),
    __metadata("design:returntype", Promise)
], BatchImportController.prototype, "processUploadedFile", null);
BatchImportController = __decorate([
    (0, common_1.Controller)('batch-import'),
    __metadata("design:paramtypes", [batch_import_service_1.BatchImportService])
], BatchImportController);
exports.BatchImportController = BatchImportController;
//# sourceMappingURL=batch-import.controller.js.map