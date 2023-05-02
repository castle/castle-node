import { Configuration } from '../../configuration';
import { CommandFetchListItemService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { ListItemPayload } from '../../payload/models';

export const APIFetchListItemService = {
  call: async (
    options: ListItemPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandFetchListItemService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
