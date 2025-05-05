import { Configuration } from '../../configuration';
import { CommandSearchEventsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type {
  SearchEventsPayload,
  SearchEventsResponse,
} from '../../payload/models';

export const APISearchEventsService = {
  call: async (
    options: SearchEventsPayload,
    configuration: Configuration
  ): Promise<SearchEventsResponse> => {
    const controller = new AbortController();
    const command = CommandSearchEventsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
