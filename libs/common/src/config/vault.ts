export const getVault = async ({
  vaultAddr,
  roleId,
  secretId,
  vaultName,
}: {
  vaultAddr: string;
  roleId: string;
  secretId: string;
  vaultName: string;
}) => {
  try {
    const vault = require('node-vault')({
      apiVersion: 'v1',
      endpoint: vaultAddr,
    });

    const result = await vault.approleLogin({
      role_id: roleId,
      secret_id: secretId,
    });

    vault.token = result.auth.client_token;

    const { data: appVault } = await vault.read(`secret/data/${vaultName}/app`); // Retrieve the secret stored in previous steps.
    const { data: dbVault } = await vault.read(`secret/data/${vaultName}/database`); // Retrieve the secret stored in previous steps.
    const { data: jwtVault } = await vault.read(`secret/data/${vaultName}/jwt`); // Retrieve the secret stored in previous steps.
    const { data: redisVault } = await vault.read(`secret/data/${vaultName}/redis`); // Retrieve the secret stored in previous steps.

    return {
      appVault,
      dbVault,
      jwtVault,
      redisVault,
    };
  } catch (error) {
    console.log(error);
  }
};
