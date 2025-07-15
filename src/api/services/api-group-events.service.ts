import { Configuration } from '../../configuration';
import { CommandGroupEventsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type {
  GroupEventsPayload,
  GroupEventsResponse,
} from '../../payload/models';

export const APIGroupEventsService = {
  call: async (
    options: GroupEventsPayload,
    configuration: Configuration
  ): Promise<GroupEventsResponse> => {
    const controller = new AbortController();
    const command = CommandGroupEventsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
