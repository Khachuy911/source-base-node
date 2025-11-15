/**
 * Escape special characters in a search string for safe usage in SQL LIKE/ILIKE queries.
 * This function escapes characters like %, _, \, and ' to avoid wildcard and syntax issues.
 *
 * @param search - The raw search string input by the user.
 * @returns A sanitized search string safe for SQL ILIKE queries.
 */
export function escapeSearchString(search: string): string {
  if (!search) {
    return '';
  }

  return search
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_')
    .replace(/'/g, "''");
}
