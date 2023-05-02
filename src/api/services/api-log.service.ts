import { Configuration } from '../../configuration';
import { CommandLogService } from '../../command/command.module';
import type { LogPayload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APILogService = {
  call: async (
    options: LogPayload,
    configuration: Configuration
  ): Promise<void> => {
    const controller = new AbortController();
    const command = CommandLogService.call(controller, options, configuration);

    APIService.call(controller, command, configuration);
  },
};
