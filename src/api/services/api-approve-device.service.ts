import { Configuration } from '../../configuraton';
import { CommandApproveDeviceService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIApproveDeviceService = {
  call: async (
    options: { device_token: string },
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandApproveDeviceService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
