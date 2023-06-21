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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../../database/entities/user.entity");
const constant_1 = __importDefault(require("../../config/constant"));
const sequelize_1 = require("sequelize");
let UserService = class UserService {
    async createUser(body) {
        const saltRounds = constant_1.default.SALT_ROUNDS;
        const { name, email, mobile, password, role } = body;
        const existingUser = await user_entity_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email }, { mobile }],
            },
        });
        if (existingUser) {
            if (existingUser.email === email) {
                throw new common_1.ConflictException('Email is already present');
            }
            if (existingUser.mobile === mobile) {
                throw new common_1.ConflictException('Mobile number is already present');
            }
        }
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            const newUser = await user_entity_1.User.create({
                name,
                email,
                mobile,
                password: hashPassword,
                role_type: role,
            });
            return {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                role: newUser.role_type,
            };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('User not Created');
        }
    }
    async get(userid) {
        const user = await user_entity_1.User.findByPk(userid, {
            attributes: {
                exclude: ['password'],
            },
        });
        if (!user)
            throw new common_1.BadRequestException('User not Found');
        return user;
    }
    async list(page, size) {
        const list = await user_entity_1.User.findAndCountAll({
            attributes: {
                exclude: ['password'],
            },
            limit: size,
            offset: page * size,
            order: [['created_at', 'DESC']],
        });
        return {
            data: list.rows,
            page: page,
            totalPages: Math.ceil(list.count / Number(size)),
            count: list.count,
        };
    }
    async update(userid, UpdateUserDto) {
        const { name, mobile, email, password, role } = UpdateUserDto;
        const user = await user_entity_1.User.findByPk(userid);
        if (!user)
            throw new common_1.BadRequestException('User not Found');
        const updateFields = {};
        const existingUser = await user_entity_1.User.findOne({
            where: {
                [sequelize_1.Op.or]: [{ email }, { mobile }],
            },
        });
        if (existingUser) {
            if (mobile &&
                mobile === existingUser.mobile &&
                existingUser.id != userid) {
                throw new common_1.ConflictException('Mobile number already exists');
            }
            if (email && email === existingUser.email && existingUser.id != userid) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (email)
            updateFields['email'] = email;
        if (mobile)
            updateFields['mobile'] = mobile;
        if (name)
            updateFields['name'] = name;
        if (password) {
            const salt = await bcrypt.genSalt(constant_1.default.SALT_ROUNDS);
            const hashPassword = await bcrypt.hash(password, salt);
            updateFields['password'] = hashPassword;
        }
        if (role) {
            updateFields['role_type'] = role;
        }
        await user.update(updateFields);
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role_type,
        };
    }
    async delete(userid) {
        try {
            const deletedUser = await user_entity_1.User.destroy({ where: { id: userid } });
            if (deletedUser === 0)
                throw new common_1.BadRequestException('User not Found');
            return { message: 'User Deleted Successfully' };
        }
        catch (error) {
            console.log(error);
            throw new common_1.BadRequestException('User not Deleted');
        }
    }
};
UserService = __decorate([
    (0, common_1.Injectable)()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map