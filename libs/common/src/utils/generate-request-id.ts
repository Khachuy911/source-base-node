export async function generateRequestId(): Promise<number> {
  return Math.floor(Math.random() * Math.pow(2, 18));
}
