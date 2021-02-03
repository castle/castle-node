import { IncomingHttpHeaders } from 'http';

import { Configuration } from '../../configuraton';
import { HeadersExtractService } from '../../headers/headers.module';
export const ContextSanitizeService = {
  call: (context: any) => {
    if (!context) {
      return {};
    }

    if (!('active' in context)) {
      return context;
    }

    if (typeof context.active === 'boolean') {
      return context;
    }

    delete context.active;

    return context;
  },
};
