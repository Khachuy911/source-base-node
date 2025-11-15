import { BaseRequest } from '@lib/base';

export interface ExternalRequest extends BaseRequest {
  user?: { tenantId: string };
}
