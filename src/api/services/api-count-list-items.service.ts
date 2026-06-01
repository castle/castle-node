import { Configuration } from '../../configuration';
import { CommandCountListItemsService } from '../../command/command.module';
import { APIService } from './api.service';
import type { CountListItemsPayload } from '../../payload/models';

export const APICountListItemsService = {
  call: async (
    options: CountListItemsPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandCountListItemsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
