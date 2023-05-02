import { Configuration } from '../../configuration';
import { CommandFetchListService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { ListPayload } from '../../payload/models';

export const APIFetchListService = {
  call: async (
    options: ListPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandFetchListService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
