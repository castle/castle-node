import { Configuration } from '../../configuraton';
import { CommandReportDeviceService } from '../../command/command.module';
import { Payload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIReportDeviceService = {
  call: async (
    options: Payload,
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
