import { getVault } from './vault';

export default async () => {
  const roleId = process.env.ROLE_ID;
  const secretId = process.env.SECRET_ID;
  const vaultAddr = process.env.VAULT_ADDR;
  const vaultName = process.env.VAULT_NAME;

  const { appVault, dbVault, jwtVault, redisVault } = await getVault({
    vaultAddr,
    roleId,
    secretId,
    vaultName,
  });

  return {
    appConfig: {
      baseUrl: appVault.data.BASE_URL,
      nodeEnv: appVault.data.NODE_ENV,
      port: parseInt(appVault.data.PORT, 10),
      apiTimeoutMs: parseInt(appVault.data.TIMEOUT_MILLISECONDS, 10),
      swaggerEnable: appVault.data.SWAGGER_ENABLE === 'true',
      redisServerPort: appVault.data.REDIS_SERVER_PORT,
    },
    jwtConfig: {
      refreshKey: jwtVault.data.JWT_REFRESH_TOKEN_SECRET_KEY,
      accessKey: jwtVault.data.JWT_ACCESS_TOKEN_SECRET_KEY,
      refreshExpTime: jwtVault.data.JWT_REFRESH_TOKEN_EXPIRE_TIME,
      accessExpTime: jwtVault.data.JWT_ACCESS_TOKEN_EXPIRE_TIME,
      verificationKey: jwtVault.data.JWT_VERIFICATION_TOKEN_SECRET_KEY,
      verificationExpTime: jwtVault.data.JWT_VERIFICATION_TOKEN_EXPIRE_TIME,
    },
    dbConfig: {
      host: dbVault.data.POSTGRES_HOST,
      port: parseInt(dbVault.data.POSTGRES_PORT, 10),
      username: dbVault.data.POSTGRES_USER,
      password: dbVault.data.POSTGRES_PASSWORD,
      database: dbVault.data.POSTGRES_DATABASE,
    },
    redisConfig: {
      cacheEnabled: redisVault.data.REDIS_CACHE_ENABLED,
      host: redisVault.data.REDIS_HOST,
      port: redisVault.data.REDIS_PORT,
      password: redisVault.data.REDIS_PASSWORD,
      extraTime: parseInt(redisVault.data.REDIS_EXTRA_TIME, 10),
    }
  };
};
