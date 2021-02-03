export const HeadersGetCookieService = {
  call: (cookies: string, name: string): string | undefined => {
    if (!cookies) {
      return;
    }

    const pattern = new RegExp(`(?:^|\\s+)\\s?${name}=(.*?)(?:;|$)`);
    const results = cookies.match(pattern);

    if (results && results.length == 2) {
      // return the last match
      return results[1];
    }

    return;
  },
};
