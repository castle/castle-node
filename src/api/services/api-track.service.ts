import { Configuration } from '../../configuraton';
import { Payload } from '../../models';
import { CommandTrackService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import pino from 'pino';

export const APITrackService = {
  call: async (
    params: Payload,
    configuration: Configuration,
    logger: pino.Logger
  ): Promise<void> => {
    const controller = new AbortController();
    const command = CommandTrackService.call(controller, params, configuration);

    APIService.call(controller, command, configuration, logger);
  },
};
