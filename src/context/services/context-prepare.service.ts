import merge from 'lodash.merge';
import { Configuration } from '../../configuraton';
import { ContextGetDefaultService } from './context-get-default.service';

export const ContextPrepareService = {
  call: (context: any, configuration: Configuration) => {
    const defaultContext = ContextGetDefaultService.call(
      context,
      configuration
    );
    return merge(context, defaultContext);
  },
};
