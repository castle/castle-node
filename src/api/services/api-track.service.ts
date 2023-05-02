import { Configuration } from '../../configuration';
import { CommandTrackService } from '../../command/command.module';
import type { Payload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APITrackService = {
  call: async (
    options: Payload,
    configuration: Configuration
  ): Promise<void> => {
    const controller = new AbortController();
    const command = CommandTrackService.call(
      controller,
      options,
      configuration
    );

    APIService.call(controller, command, configuration);
  },
};
