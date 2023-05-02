import { Configuration } from '../../configuration';
import { CommandSearchListItemsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { SearchListItemsPayload } from '../../payload/models';

export const APISearchListItemsService = {
  call: async (
    options: SearchListItemsPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandSearchListItemsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
