import { Configuration } from '../../configuraton';
import { CommandGenerateService } from './command-generate.service';
import { Payload } from '../../payload/payload.module';

export const CommandGetDeviceService = {
  call: (controller, options: Payload, configuration: Configuration) => {
    return CommandGenerateService.call(
      controller,
      `devices/${options.device_token}`,
      {},
      'GET',
      configuration
    );
  },
};
