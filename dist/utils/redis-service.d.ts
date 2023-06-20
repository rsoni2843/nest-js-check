export declare class RedisService {
    private client;
    constructor();
    set(id: string, refreshtoken: string, expiresIn: number): Promise<void>;
    get(key: string): Promise<any>;
    del(key: string): Promise<void>;
}
