import { Configuration } from '../../configuraton';
import { Payload } from '../../models';
import { CommandReportDeviceService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIReportDeviceService = {
  call: async (
    options: { device_token: string },
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandReportDeviceService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
