import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import Redlock from 'redlock';
import { AppsConfigService } from '../apps-config.service';
import { Logger } from '../winston/winston.decorator';
import { WinstonService } from '../winston/winston.service';

@Injectable()
export class RedisService {
  public commonRedis: Redis;
  public redisTimeOut: Redis;
  public timeoutSub: Redis;
  private messageSub: Redis;
  private messagePub: Redis;
  private redlock: Redlock;

  constructor(
    readonly configService: AppsConfigService,
    @Logger('Redis') private readonly logger: WinstonService,
  ) {
    this.connectToRedis(configService);

    // Avoiding race condition. Reference: https://redis.com/glossary/redis-lock/
    this.redlock = new Redlock([this.commonRedis], {
      driftFactor: 0.01, // time in ms
      retryCount: -1,
      retryDelay: 200, // time in ms
      retryJitter: 200, // time in ms
    });
  }

  connectToRedis(configService: AppsConfigService) {
    const config = {
      port: Number(configService.redisConfig.port),
      host: configService.redisConfig.host,
      password: configService.redisConfig.password,
    };

    this.commonRedis = this.connectToRedisInstance('Common Redis', { ...config, db: 0 });
  }

  connectToRedisInstance(name: string, config: any) {
    const redisInstance = new Redis(config.port, config.host, {
      password: config.password,
      db: config.db,
      showFriendlyErrorStack: true,
    });

    redisInstance.on('connect', () => {
      this.logger.info(`Connected to ${name}`);
    });

    redisInstance.on('error', (error) => {
      this.logger.error(`Error connecting to ${name}:`, error);
    });

    return redisInstance;
  }


  // avoid race condition in database. FMI: https://redis.io/docs/manual/patterns/distributed-locks/
  createRedisLock(resource: string[], ttl: number = 5000) {
    return this.redlock.acquire([...resource], ttl);
  }

  /**
   * async: Generic get data by key
   */
  async getOrInsert<T>(parentKey: string, key: string, fetcher: () => Promise<T>) {
    if (!this.commonRedis) return await fetcher();

    return new Promise(async (resolve, reject) => {
      try {
        // Use the 'hget' command to get the 'child' key from the parent hash
        const value = parentKey
          ? await this.commonRedis.hget(parentKey, key)
          : await this.commonRedis.get(key);
        // If value is not in cache, fetch it and return it
        if (!value) {
          const result = await fetcher();
          if (result) {
            // Use the 'hset' command to set the child data as a hash field under the parent key
            parentKey
              ? await this.commonRedis.hset(parentKey, key, JSON.stringify(result), (err: any) => {
                  if (err) return reject(err);
                })
              : await this.commonRedis.set(key, JSON.stringify(result), (err: any) => {
                  if (err) return reject(err);
                });
          }
          return resolve(result);
        }
        // return cached value
        return resolve(JSON.parse(value));
      } catch (error) {
        return reject(error);
      }
    }) as Promise<T>;
  }

  async set(key: string, value: string, expire?: number) {
    if (expire) {
      return await this.commonRedis.set(key, value, 'EX', expire);
    }
    return await this.commonRedis.set(key, value);
  }

  async setTimeout(key: string, value: string, expire: number) {
    return await this.redisTimeOut.set(key, value, 'EX', expire);
  }

  async get(key: string) {
    return await this.commonRedis.get(key);
  }

  async getBulk(keys: string[]) {
    return this.commonRedis.mget(keys);
  }

  async del(key: string) {
    await this.commonRedis.del(key);
  }

  async delTimeout(key: string) {
    await this.redisTimeOut.del(key);
  }

  async setHash(key: string, field: string, value: string) {
    await this.commonRedis.hset(key, field, value);
  }

  async setMultiHash(key: string, data: Record<string, any>) {
    await this.commonRedis.hmset(key, data);
  }

  async getHash(key: string, field: string) {
    return await this.commonRedis.hget(key, field);
  }

  async getMultiHash(key: string, fields: string[]) {
    return await this.commonRedis.hmget(key, ...fields);
  }

  async getAllValuesInHash(key: string) {
    return await this.commonRedis.hvals(key);
  }

  async delHash(key: string, field: string) {
    await this.commonRedis.hdel(key, field);
  }

  async clearAll() {
    await Promise.all([this.commonRedis.flushall(), this.redisTimeOut.flushall()]);
  }

  async isKeyExist(key: string) {
    return await this.commonRedis.exists(key);
  }

  async deleteKeysWithPattern(pattern: string, batchSize = 100) {
    let cursor = '0';

    do {
      // SCAN command to find matching keys
      const result = await this.commonRedis.scan(cursor, 'MATCH', pattern, 'COUNT', batchSize);
      cursor = result[0];
      const keys = result[1];

      if (keys.length > 0) {
        await this.commonRedis.del(...keys);
      }
    } while (cursor !== '0'); // Continue until cursor is 0 (end of iteration)
  }

  async getRedisTtl(key: string) {
    return await this.commonRedis.ttl(key);
  }

  async appendToList(key: string, value: string) {
    return await this.commonRedis.rpush(key, value);
  }

  async prependToList(key: string, value: string) {
    return await this.commonRedis.lpush(key, value);
  }

  async getList(key: string) {
    return await this.commonRedis.lrange(key, 0, -1);
  }

  // Function to pop and remove the first N elements
  async popMultipleFromList(key: string, count: number) {
    const elements = await this.commonRedis.lrange(key, 0, count - 1); // Get first N elements
    await this.commonRedis.ltrim(key, count, -1); // Remove the first N elements
    return elements;
  }

  async getAllAndDeleteList(key) {
    // Get all values in the list
    const values = await this.getList(key);

    // Delete the list key
    await this.del(key);

    return values;
  }

  async getListLength(key: string) {
    return await this.commonRedis.llen(key);
  }
}
