import { Configuration } from '../../configuration';
import { CommandGetDeviceService } from '../../command/command.module';
import { Payload } from '../../payload/payload.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIGetDeviceService = {
  call: async (
    options: Payload,
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
