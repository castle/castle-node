import { Configuration } from '../../configuration';
import { CommandCreateListService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { CreateListPayload } from '../../payload/models';

export const APICreateListService = {
  call: async (
    options: CreateListPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandCreateListService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
