"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const service_logger_1 = require("./utils/service-logger");
const env_1 = __importDefault(require("./config/env"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, cookie_parser_1.default)());
    const appPort = env_1.default.app.port;
    app.enableCors({
        origin: (origin, cb) => {
            cb(null, true);
        },
        credentials: true,
    });
    await app.listen(appPort || 3000);
    service_logger_1.logger.info('Pricing Calculator started on: ' + appPort);
}
bootstrap();
//# sourceMappingURL=main.js.map