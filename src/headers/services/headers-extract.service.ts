import { IncomingHttpHeaders } from 'http';
import { reduce } from 'lodash';

const ALWAYS_ALLOWLISTED = ['user-agent'];
const ALWAYS_DENYLISTED = ['cookie', 'authorization'];

export const HeadersExtractService = {
  call: (
    headers: IncomingHttpHeaders,
    allowlisted: string[],
    denylisted: string[]
  ) => {
    return reduce(
      headers,
      (accumulator: object, value: string, key: string) => {
        if (ALWAYS_DENYLISTED.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: true,
          };
        }

        if (ALWAYS_ALLOWLISTED.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: value,
          };
        }

        if (denylisted.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: true,
          };
        }

        if (allowlisted.length && !allowlisted.includes(key.toLowerCase())) {
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
