import { randomInt } from 'crypto';

export function generateOTP() {
  const otp = randomInt(100000, 1000000); // Generates a random integer between 100000 and 999999
  return otp.toString();
}
