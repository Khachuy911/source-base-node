export function extractQueryParams(url: string) {
  const queryString = url.split('?')[1];
  const query: any = {};
  if (queryString) {
    queryString.split('&').forEach((part) => {
      const item = part.split('=');
      query[item[0]] = decodeURIComponent(item[1]);
    });
  }

  return query;
}
