
At root directory, run the following command to install all the dependencies for all the services

```bash
$ pnpm install
```

> Installing packages for root directory

```bash
$ pnpm install --workspace-root <library-name>
```

> Installing packages for specific service

```bash
$ pnpm install --filter <service-name> <library-name>
```

## Access environment variables

Access Hashicorp Vault to get environment variables

```bash
http://192.168.101.60:8200/
```
> [!IMPORTANT]
> The **Vault** address may differ depending on which server it is deployed on.

Run source
```bash
$ pnpm dev:api
$ pnpm dev:socket
```
