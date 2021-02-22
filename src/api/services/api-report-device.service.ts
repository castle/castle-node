import { Configuration } from '../../configuraton';
import { Payload } from '../../models';
import { CommandReportDeviceService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIReportDeviceService = {
  call: async (params: Payload, configuration: Configuration): Promise<any> => {
    const controller = new AbortController();
    const command = CommandReportDeviceService.call(
      controller,
      params,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
