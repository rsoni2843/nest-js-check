import {
  HttpException,
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from 'src/database/entities/user.entity';
import { SignUpDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
import constant from 'src/config/constant';
import { Op } from 'sequelize';

@Injectable()
export class UserService {
  async createUser(body: SignUpDto) {
    const saltRounds = constant.SALT_ROUNDS;
    const { name, email, mobile, password, role } = body;
    // Check if mobile number or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email is already present');
      }
      if (existingUser.mobile === mobile) {
        throw new ConflictException('Mobile number is already present');
      }
    }
    const salt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, salt);
    try {
      const newUser = await User.create({
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
    } catch (error) {
      console.log(error);
      throw new BadRequestException('User not Created');
    }
  }
  async get(userid: string) {
    const user = await User.findByPk(userid, {
      attributes: {
        exclude: ['password'],
      },
    });
    if (!user) throw new BadRequestException('User not Found');
    return user;
  }
  async list(page: number, size: number) {
    const list = await User.findAndCountAll({
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

  async update(userid: string, UpdateUserDto: UpdateUserDto) {
    const { name, mobile, email, password, role } = UpdateUserDto;
    const user = await User.findByPk(userid);
    if (!user) throw new BadRequestException('User not Found');
    const updateFields = {};
    // Check if mobile number or email already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { mobile }],
      },
    });

    if (existingUser) {
      if (
        mobile &&
        mobile === existingUser.mobile &&
        existingUser.id != userid
      ) {
        throw new ConflictException('Mobile number already exists');
      }

      if (email && email === existingUser.email && existingUser.id != userid) {
        throw new ConflictException('Email already exists');
      }
    }

    if (email) updateFields['email'] = email;
    if (mobile) updateFields['mobile'] = mobile;
    if (name) updateFields['name'] = name;
    if (password) {
      const salt = await bcrypt.genSalt(constant.SALT_ROUNDS);
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
  async delete(userid: string) {
    try {
      const deletedUser = await User.destroy({ where: { id: userid } });
      if (deletedUser === 0) throw new BadRequestException('User not Found');
      return { message: 'User Deleted Successfully' };
    } catch (error) {
      console.log(error);
      throw new BadRequestException('User not Deleted');
    }
  }
}
