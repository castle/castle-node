import { IncomingHttpHeaders } from 'http2';
import reduce from 'lodash.reduce';
import { Configuration } from '../../configuraton';

const ALWAYS_ALLOWLISTED = ['user-agent'];
const ALWAYS_DENYLISTED = ['cookie', 'authorization'];

export const HeadersExtractService = {
  call: (
    headers: IncomingHttpHeaders,
    configuration: Configuration
  ): { [key: string]: boolean | string } => {
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

        if (configuration.denylisted.includes(key.toLowerCase())) {
          return {
            ...accumulator,
            [key]: true,
          };
        }

        if (
          configuration.allowlisted.length === 0 ||
          configuration.allowlisted.includes(key.toLowerCase())
        ) {
          return {
            ...accumulator,
            [key]: value,
          };
        }

        return {
          ...accumulator,
          [key]: true,
        };
      },
      {}
    );
  },
};
