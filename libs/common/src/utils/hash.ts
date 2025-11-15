import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function hashData(data: string, salt?: string): Promise<string> {
  salt = salt ? salt : crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt);
  hash.update(data);
  const hashPW = hash.digest('hex');
  return `${salt}.${hashPW}`;
}

export async function compareHash(data: string, hash: string): Promise<boolean> {
  const [storedSalt] = hash.split('.');
  const hashedPassword = await hashData(data, storedSalt);
  const isMatch = hashedPassword === hash;
  return isMatch ? isMatch : await bcrypt.compare(data, hash);
}
