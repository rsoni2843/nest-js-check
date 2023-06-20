"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportFilesModule = void 0;
const report_files_service_1 = require("./report-files.service");
const report_files_controller_1 = require("./report-files.controller");
const common_1 = require("@nestjs/common");
let ReportFilesModule = class ReportFilesModule {
};
ReportFilesModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [report_files_controller_1.ReportFilesController],
        providers: [report_files_service_1.ReportFilesService],
    })
], ReportFilesModule);
exports.ReportFilesModule = ReportFilesModule;
//# sourceMappingURL=report-files.module.js.map