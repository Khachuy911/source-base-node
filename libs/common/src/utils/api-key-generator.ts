import crypto from 'crypto';

export function generateRamdomKey() {
  return crypto.randomBytes(64).toString('base64').replace(/[+/=]/g, '');
}
