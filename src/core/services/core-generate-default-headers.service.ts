import { Configuration } from '../../configuration';

export const CoreGenerateDefaultHeadersService = {
  call: (configuration: Configuration) => {
    return {
      Authorization: `Basic ${Buffer.from(
        `:${configuration.apiSecret}`
      ).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  },
};
