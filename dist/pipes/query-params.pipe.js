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
exports.ParseArrayPipe = exports.ParseEnumPipe = exports.DateFormatConversionPipe = exports.ParseSortingPipe = exports.ParseQueryPipe = exports.sorting_order = void 0;
const common_1 = require("@nestjs/common");
const date_fns_1 = require("date-fns");
var sorting_order;
(function (sorting_order) {
    sorting_order["DESC"] = "desc";
    sorting_order["ASC"] = "asc";
})(sorting_order = exports.sorting_order || (exports.sorting_order = {}));
let ParseQueryPipe = class ParseQueryPipe {
    constructor(defaultValue = 0) {
        this.defaultValue = defaultValue;
    }
    transform(value, metadata) {
        const val = parseInt(value, 10);
        return isNaN(val) ? this.defaultValue : val;
    }
};
ParseQueryPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Number])
], ParseQueryPipe);
exports.ParseQueryPipe = ParseQueryPipe;
let ParseSortingPipe = class ParseSortingPipe {
    constructor() { }
    transform(value, metadata) {
        if (value === sorting_order.DESC)
            return sorting_order.DESC;
        else if (value === sorting_order.ASC)
            return sorting_order.ASC;
        else
            return undefined;
    }
};
ParseSortingPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], ParseSortingPipe);
exports.ParseSortingPipe = ParseSortingPipe;
let DateFormatConversionPipe = class DateFormatConversionPipe {
    constructor(type) {
        this.type = type;
    }
    transform(value, metadata) {
        if ((value === undefined || value == '') && this.type == 'startDate') {
            const parsedDate = (0, date_fns_1.format)((0, date_fns_1.subDays)(new Date(), 100), 'yyyy-MM-dd HH:mm:ss');
            const startDate = (0, date_fns_1.parse)(parsedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
            return startDate;
        }
        else if ((value === undefined || value == '') && this.type == 'endDate') {
            const parsedDate = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
            const endDate = (0, date_fns_1.parse)(parsedDate, 'yyyy-MM-dd HH:mm:ss', new Date());
            return endDate;
        }
        else {
            const setDate = (0, date_fns_1.format)(new Date(value), 'yyyy-MM-dd HH:mm:ss');
            const parsedDate = (0, date_fns_1.parse)(setDate, 'yyyy-MM-dd HH:mm:ss', new Date());
            if (!parsedDate) {
                throw new common_1.BadRequestException('Yo !! Invalid date format');
            }
            return parsedDate;
        }
    }
};
DateFormatConversionPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], DateFormatConversionPipe);
exports.DateFormatConversionPipe = DateFormatConversionPipe;
let ParseEnumPipe = class ParseEnumPipe {
    constructor(possibleValues) {
        this.possibleValues = possibleValues;
    }
    transform(value, metadata) {
        if (this.possibleValues.indexOf(value) != -1)
            return value;
        else
            return undefined;
    }
};
ParseEnumPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Array])
], ParseEnumPipe);
exports.ParseEnumPipe = ParseEnumPipe;
let ParseArrayPipe = class ParseArrayPipe {
    transform(value, metadata) {
        if (Array.isArray(value))
            return value.map((v) => +v);
        else
            return undefined;
    }
};
ParseArrayPipe = __decorate([
    (0, common_1.Injectable)()
], ParseArrayPipe);
exports.ParseArrayPipe = ParseArrayPipe;
//# sourceMappingURL=query-params.pipe.js.map