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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigurationController = void 0;
const configuration_dto_1 = require("./dto/configuration.dto");
const configuration_service_1 = require("./configuration.service");
const common_1 = require("@nestjs/common");
const query_params_pipe_1 = require("../../pipes/query-params.pipe");
let ConfigurationController = class ConfigurationController {
    constructor(ConfigurationService) {
        this.ConfigurationService = ConfigurationService;
    }
    async create(data) {
        return await this.ConfigurationService.create(data);
    }
    async getByDomain(domain) {
        const config = await this.ConfigurationService.getByDomain(domain);
        if (config) {
            throw new common_1.ConflictException('configuration for this domain already exist');
        }
        return {
            exists: false,
        };
    }
    async list(page, size, dropdown_list) {
        return await this.ConfigurationService.list(page, size, !dropdown_list);
    }
    async get(id) {
        return await this.ConfigurationService.get(id);
    }
    async update(id, data) {
        return await this.ConfigurationService.update(id, data);
    }
    async remove(id) {
        await this.ConfigurationService.remove(id);
        return {
            message: 'Deleted Successfully',
        };
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [configuration_dto_1.ConfigurationCreateArgs]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('domain/:domain'),
    __param(0, (0, common_1.Param)('domain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "getByDomain", null);
__decorate([
    (0, common_1.Get)('list'),
    __param(0, (0, common_1.Query)('page', new query_params_pipe_1.ParseQueryPipe(0))),
    __param(1, (0, common_1.Query)('size', new query_params_pipe_1.ParseQueryPipe(10))),
    __param(2, (0, common_1.Query)('dropdown_list')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Boolean]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, configuration_dto_1.ConfigurationUpdateArgs]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ConfigurationController.prototype, "remove", null);
ConfigurationController = __decorate([
    (0, common_1.Controller)('configuration'),
    __metadata("design:paramtypes", [configuration_service_1.ConfigurationService])
], ConfigurationController);
exports.ConfigurationController = ConfigurationController;
//# sourceMappingURL=configuration.controller.js.map