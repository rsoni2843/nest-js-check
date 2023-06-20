import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import env from 'src/config/env';

@Injectable()
export class RedisService {
  private client = new Redis(env.redis_uri);
  constructor() {
    this.client.connect().then(() => {
      console.log('Connected to Redis');
    });
    this.client.on('error', (error) => {
      console.log('Redis Error', error);
    });
    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });
  }
  async set(
    id: string,
    refreshtoken: string,
    expiresIn: number,
  ): Promise<void> {
    await this.client.set(id, refreshtoken);
    await this.client.expire(id, expiresIn);
  }

  async get(key: string): Promise<any> {
    try {
      return this.client.get(key);
      return null;
    } catch (error) {
      console.log(error);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
