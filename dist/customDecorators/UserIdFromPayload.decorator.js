"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIdFromPayload = void 0;
const common_1 = require("@nestjs/common");
exports.UserIdFromPayload = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.payload.userId;
});
//# sourceMappingURL=UserIdFromPayload.decorator.js.map