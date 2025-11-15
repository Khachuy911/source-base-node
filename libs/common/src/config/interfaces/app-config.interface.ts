export interface AppConfig {
  baseUrl: string;
  nodeEnv: string;
  port: number;
  redisServerPort: number;
  apiTimeoutMs: number;
  swaggerEnable: boolean;
}
