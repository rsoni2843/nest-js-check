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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../database/entities/user.entity");
const sequelize_1 = require("sequelize");
const jwt = __importStar(require("jsonwebtoken"));
const env_1 = __importDefault(require("../../config/env"));
const redis_service_1 = require("../../utils/redis-service");
const constant_1 = __importDefault(require("../../config/constant"));
let AuthService = class AuthService {
    constructor(redisService) {
        this.redisService = redisService;
    }
    async deleteRefreshToken(userId) {
        try {
            this.redisService.del(userId);
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException('Failed to delete refresh token');
        }
    }
    async login(body) {
        const { email_or_mobile, password } = body;
        const access_token_expiry = constant_1.default.TIME_FRAMES.ACCESS_TOKEN_EXPIRY;
        const refresh_token_expiry = constant_1.default.TIME_FRAMES.REFRESH_TOKEN_EXPIRY;
        const user = await user_entity_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email: email_or_mobile }, { mobile: email_or_mobile }],
            },
        });
        if (!user) {
            throw new common_1.NotFoundException('User with this Credential not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new common_1.HttpException('Email or Mobile and Password in Not Matching', common_1.HttpStatus.UNAUTHORIZED);
        }
        const acesstoken = jwt.sign({
            userId: user.id,
            role: user.role_type,
        }, env_1.default.secrets.access_token_secret, { expiresIn: access_token_expiry });
        const refreshtoken = jwt.sign({
            userId: user.id,
            role: user.role_type,
        }, env_1.default.secrets.refresh_token_secret, { expiresIn: refresh_token_expiry });
        try {
            this.redisService.set(user.id, refreshtoken, constant_1.default.TIME_FRAMES.SEVEN_DAYS);
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException('Unable to Login');
        }
        return { acesstoken, refreshtoken };
    }
    async requestAccessToken(body) {
        const access_token_expiry = constant_1.default.TIME_FRAMES.ACCESS_TOKEN_EXPIRY;
        const { refreshToken } = body;
        try {
            const decoded = jwt.verify(refreshToken, env_1.default.secrets.refresh_token_secret);
            const { userId, role } = decoded;
            const refresh_token = await this.redisService.get(userId);
            if (!refresh_token)
                throw new common_1.BadRequestException('Invalid Refresh Token');
            const acesstoken = jwt.sign({
                userId: userId,
                role: role,
            }, env_1.default.secrets.access_token_secret, { expiresIn: access_token_expiry });
            return acesstoken;
        }
        catch (err) {
            console.log(err);
            throw new common_1.BadRequestException('Invalid Refresh Token');
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.services.js.map