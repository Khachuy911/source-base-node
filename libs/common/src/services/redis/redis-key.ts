export class RedisKey {
  static TOKEN_BLACK_LIST = (userId: string) => `TOKEN:${userId}`;
}
