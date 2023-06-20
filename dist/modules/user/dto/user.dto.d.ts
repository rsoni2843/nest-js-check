import { roleType } from 'src/database/entities/user.entity';
export declare class SignUpDto {
    readonly name: string;
    readonly email: string;
    readonly mobile: string;
    readonly password: string;
    readonly role: roleType;
}
export declare class UpdateUserDto {
    readonly name?: string;
    readonly mobile?: string;
    readonly email?: string;
    readonly password?: string;
    readonly role?: roleType;
}
