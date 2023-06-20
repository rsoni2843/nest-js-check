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
exports.ProductCompetitorUpdateArgs = exports.ProductCompetitorCreateArgs = void 0;
const class_validator_1 = require("class-validator");
class ProductCompetitorCreateArgs {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProductCompetitorCreateArgs.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ProductCompetitorCreateArgs.prototype, "competitor_url", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCompetitorCreateArgs.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductCompetitorCreateArgs.prototype, "in_stock", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductCompetitorCreateArgs.prototype, "is_grouped", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorCreateArgs.prototype, "price_query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorCreateArgs.prototype, "stock_query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorCreateArgs.prototype, "stock_pattern", void 0);
exports.ProductCompetitorCreateArgs = ProductCompetitorCreateArgs;
class ProductCompetitorUpdateArgs {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ProductCompetitorUpdateArgs.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], ProductCompetitorUpdateArgs.prototype, "competitor_url", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], ProductCompetitorUpdateArgs.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ProductCompetitorUpdateArgs.prototype, "in_stock", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorUpdateArgs.prototype, "price_query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorUpdateArgs.prototype, "stock_query", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], ProductCompetitorUpdateArgs.prototype, "stock_pattern", void 0);
exports.ProductCompetitorUpdateArgs = ProductCompetitorUpdateArgs;
//# sourceMappingURL=product-competitor.body.js.map