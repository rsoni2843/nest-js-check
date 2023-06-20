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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_services_1 = require("./auth.services");
const auth_dto_1 = require("./dto/auth.dto");
const auth_dto_2 = require("./dto/auth.dto");
const auth_guard_1 = require("../../guards/auth.guard");
const UserIdFromPayload_decorator_1 = require("../../customDecorators/UserIdFromPayload.decorator");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.TOKEN_LIMIT = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000);
        this.cookieOptions = {
            expires: this.TOKEN_LIMIT,
            httpOnly: true,
            secure: true,
            origin: 'productcompare.dentalkart.com',
        };
    }
    async logout(userId, response) {
        response.clearCookie('access_token');
        await this.authService.deleteRefreshToken(userId);
        return {
            message: 'Logout Successfully',
        };
    }
    async login(body, response) {
        const user = await this.authService.login(body);
        response.cookie('access_token', user.acesstoken, this.cookieOptions);
        return {
            refresh_token: user.refreshtoken,
        };
    }
    async requestAccessToken(refreshToken, response) {
        const acesstoken = await this.authService.requestAccessToken(refreshToken);
        response.cookie('access_token', acesstoken, this.cookieOptions);
        return {
            message: 'Login Successfully by Refresh Token',
        };
    }
};
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('logout'),
    __param(0, (0, UserIdFromPayload_decorator_1.UserIdFromPayload)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('request-access-token'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_2.LoginbyRefreshTokenDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "requestAccessToken", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_services_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map