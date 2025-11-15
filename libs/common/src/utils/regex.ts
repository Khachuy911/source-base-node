export function getNumberFromString(str: string) {
  return str.match(/\d+/g)?.map(Number) || [];
}
