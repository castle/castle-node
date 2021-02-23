import { Configuration } from '../../configuraton';
import { CommandGetDevicesForUserService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIGetDevicesForUserService = {
  call: async (
    options: { user_id: string },
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandGetDevicesForUserService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
