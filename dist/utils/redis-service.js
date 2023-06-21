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
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = __importDefault(require("../config/env"));
let RedisService = class RedisService {
    constructor() {
        this.client = new ioredis_1.default(env_1.default.redis_uri);
        this.client.connect().then(() => {
            console.log('Connected to Redis');
        });
        this.client.on('error', (error) => {
            console.log('Redis Error', error);
        });
        this.client.on('connect', () => {
            console.log('Connected to Redis');
        });
    }
    async set(id, refreshtoken, expiresIn) {
        await this.client.set(id, refreshtoken);
        await this.client.expire(id, expiresIn);
    }
    async get(key) {
        try {
            return this.client.get(key);
            return null;
        }
        catch (error) {
            console.log(error);
        }
    }
    async del(key) {
        await this.client.del(key);
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis-service.js.map