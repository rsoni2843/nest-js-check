import { User } from 'src/database/entities/user.entity';
import { SignUpDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/user.dto';
export declare class UserService {
    createUser(body: SignUpDto): Promise<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        role: import("src/database/entities/user.entity").roleType;
    }>;
    get(userid: string): Promise<User>;
    list(page: number, size: number): Promise<{
        data: User[];
        page: number;
        totalPages: number;
        count: number;
    }>;
    update(userid: string, UpdateUserDto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        role: import("src/database/entities/user.entity").roleType;
    }>;
    delete(userid: string): Promise<{
        message: string;
    }>;
}
