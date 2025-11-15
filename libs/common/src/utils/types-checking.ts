export function isObject(obj: unknown): obj is Record<PropertyKey, any> {
  return obj !== null && typeof obj === 'object';
}

export function isArray<T = any>(data: unknown): data is T[] {
  return Array.isArray(data);
}

export function isString(data: unknown): data is string {
  return typeof data === 'string';
}

export function isNumber(data: unknown): data is number {
  return typeof data === 'number';
}

export function isBoolean(data: unknown): data is boolean {
  return typeof data === 'boolean';
}

export function isNumericString(data: string) {
  return !isNaN(Number(data));
}
