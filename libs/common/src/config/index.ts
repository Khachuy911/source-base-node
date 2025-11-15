import getConfig from './config';
import { Configuration } from './interfaces';

export default async (): Promise<Configuration> => {
  const { appConfig, jwtConfig, redisConfig, dbConfig } = await getConfig();

  return {
    app: appConfig,
    jwt: jwtConfig,
    redis: redisConfig,
    database: dbConfig,
  };
};
