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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessingLog = exports.processing_status = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const upload_log_1 = require("./upload-log");
var processing_status;
(function (processing_status) {
    processing_status["SUCCESS"] = "success";
    processing_status["FAILURE"] = "failure";
})(processing_status = exports.processing_status || (exports.processing_status = {}));
let ProcessingLog = class ProcessingLog extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], ProcessingLog.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.STRING,
        allowNull: false,
    }),
    __metadata("design:type", String)
], ProcessingLog.prototype, "product_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.ENUM,
        allowNull: false,
        values: Object.values(processing_status),
    }),
    __metadata("design:type", String)
], ProcessingLog.prototype, "status", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.JSON,
    }),
    __metadata("design:type", Array)
], ProcessingLog.prototype, "message", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => upload_log_1.UploadLog),
    __metadata("design:type", upload_log_1.UploadLog)
], ProcessingLog.prototype, "upload_log", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => upload_log_1.UploadLog),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], ProcessingLog.prototype, "upload_log_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProcessingLog.prototype, "created_at", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false }),
    __metadata("design:type", Date)
], ProcessingLog.prototype, "updated_at", void 0);
ProcessingLog = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'processing_log',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    })
], ProcessingLog);
exports.ProcessingLog = ProcessingLog;
//# sourceMappingURL=processing-logs.js.map