import { Configuration } from '../../configuraton';
import { Payload } from '../../models';
import { CommandGetDeviceService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIGetDeviceService = {
  call: async (
    options: { device_token: string },
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandGetDeviceService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
