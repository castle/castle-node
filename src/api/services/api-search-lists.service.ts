import { Configuration } from '../../configuration';
import { CommandSearchListsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { SearchListsPayload } from '../../payload/models';

export const APISearchListsService = {
  call: async (
    options: SearchListsPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandSearchListsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
