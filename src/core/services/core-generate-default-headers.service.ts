import { Configuration } from '../../models';

export const CoreGenerateDefaultHeadersService = {
  call: ({ apiSecret }: Configuration) => {
    return {
      Authorization: `Basic ${Buffer.from(`:${apiSecret}`).toString('base64')}`,
      'Content-Type': 'application/json',
    };
  },
};
