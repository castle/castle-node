import { Configuration } from '../../configuration';
import { CommandUpdateListService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { UpdateListPayload } from '../../payload/models';

export const APIUpdateListService = {
  call: async (
    options: UpdateListPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandUpdateListService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
