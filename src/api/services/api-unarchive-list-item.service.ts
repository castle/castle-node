import { Configuration } from '../../configuration';
import { CommandUnarchiveListItemService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { ListItemPayload } from '../../payload/models';

export const APIUnarchiveListItemService = {
  call: async (
    options: ListItemPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandUnarchiveListItemService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
