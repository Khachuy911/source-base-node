export function lowerCaseFirstLetter(data: string): string {
  if (data.length === 0) return data;

  return data.charAt(0).toLowerCase() + data.slice(1);
}

export function upperCaseFirstLetter(data: string): string {
  return data.charAt(0).toUpperCase() + data.slice(1);
}

export function removeEmptyLinesAndLeadingSpaces(inputString: string): string {
  return removeEmptyLines(removeLeadingSpaces(inputString));
}

export function removeEmptyLines(inputString: string): string {
  return inputString.replace(/^\s*[\r\n]/gm, '');
}

export function removeLeadingSpaces(inputString: string): string {
  return inputString.replace(/^\s+/gm, '');
}
