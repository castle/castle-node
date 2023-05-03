import { Configuration } from '../../configuration';
import { CommandArchiveListItemService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { ListItemPayload } from '../../payload/models';

export const APIArchiveListItemService = {
  call: async (
    options: ListItemPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandArchiveListItemService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
