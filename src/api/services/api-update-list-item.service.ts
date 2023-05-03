import { Configuration } from '../../configuration';
import { CommandUpdateListItemService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { UpdateListItemPayload } from '../../payload/models';

export const APIUpdateListItemService = {
  call: async (
    options: UpdateListItemPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandUpdateListItemService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
