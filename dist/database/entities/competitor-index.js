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
exports.CompetitorIndex = void 0;
const sequelize_1 = require("sequelize");
const sequelize_typescript_1 = require("sequelize-typescript");
const configuration_entity_1 = require("./configuration.entity");
let CompetitorIndex = class CompetitorIndex extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.AutoIncrement,
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.INTEGER.UNSIGNED,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CompetitorIndex.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_1.FLOAT,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], CompetitorIndex.prototype, "index", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.DATE, allowNull: false, defaultValue: new Date() }),
    __metadata("design:type", Date)
], CompetitorIndex.prototype, "found_at", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => configuration_entity_1.Configuration),
    __metadata("design:type", configuration_entity_1.Configuration)
], CompetitorIndex.prototype, "configuration", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => configuration_entity_1.Configuration),
    (0, sequelize_typescript_1.Column)({ type: sequelize_1.INTEGER.UNSIGNED, allowNull: false }),
    __metadata("design:type", Number)
], CompetitorIndex.prototype, "configuration_id", void 0);
CompetitorIndex = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'competitor_index',
        timestamps: false,
    })
], CompetitorIndex);
exports.CompetitorIndex = CompetitorIndex;
//# sourceMappingURL=competitor-index.js.map