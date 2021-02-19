import { Configuration } from '../../configuraton';
import { Payload } from '../../models';
import { CommandGetDevicesForUserService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIGetDevicesForUserService = {
  call: async (params: Payload, configuration: Configuration): Promise<any> => {
    const controller = new AbortController();
    const command = CommandGetDevicesForUserService.call(
      controller,
      params,
      configuration
    );

    return await APIService.call(controller, command, configuration);
  },
};
