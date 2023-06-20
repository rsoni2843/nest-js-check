import { Model } from 'sequelize-typescript';
export declare enum roleType {
    USER = "user",
    ADMIN = "admin",
    SUPERADMIN = "superadmin"
}
export declare class User extends Model {
    id: string;
    name: string;
    email: string;
    mobile: string;
    password: string;
    role_type: roleType;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}
