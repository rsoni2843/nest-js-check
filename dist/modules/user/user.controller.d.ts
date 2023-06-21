import { SignUpDto } from './dto/user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    get(userId: string): Promise<import("../../database/entities/user.entity").User>;
    signup(body: SignUpDto): Promise<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        role: import("../../database/entities/user.entity").roleType;
    }>;
    getUsersData(page: number, size: number): Promise<{
        data: import("../../database/entities/user.entity").User[];
        page: number;
        totalPages: number;
        count: number;
    }>;
    updateUsersData(userid: string, updation: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        mobile: string;
        role: import("../../database/entities/user.entity").roleType;
    }>;
    delete(userid: string): Promise<{
        message: string;
    }>;
}
