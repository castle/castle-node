import { Configuration } from '../../configuration';
import { CommandGetEventsSchemaService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { GetEventsSchemaResponse } from '../../payload/models';

export const APIGetEventsSchemaService = {
  call: async (
    configuration: Configuration
  ): Promise<GetEventsSchemaResponse> => {
    const controller = new AbortController();
    const command = CommandGetEventsSchemaService.call(
      controller,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
