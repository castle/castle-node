import { IncomingHttpHeaders } from 'http';
import { reduce } from 'lodash';

const ALWAYS_ALLOWLISTED = ['user-agent'];
const ALWAYS_DENYLISTED = ['cookie', 'authorization'];

export const HeadersExtractorService = {
  call: (
    headers: IncomingHttpHeaders,
    allowedHeaders: string[],
    disallowedHeaders: string[]
  ) => {
    return reduce(
      headers,
      (accumulator: object, value: string, key: string) => {
        if (disallowedHeaders.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: true,
          };
        }
        if (
          allowedHeaders.length &&
          !allowedHeaders.includes(key.toLowerCase())
        ) {
          return {
            ...accumulator,
            [key]: true,
          };
        }

        return {
          ...accumulator,
          [key]: value,
        };
      },
      {}
    );
  },
};
