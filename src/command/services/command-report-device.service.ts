import { Configuration } from '../../configuraton';
import { CommandGenerateService } from './command-generate.service';

export const CommandReportDeviceService = {
  call: (controller, options: any, configuration: Configuration) => {
    return CommandGenerateService.call(
      controller,
      `devices/${options.device_token}/report`,
      {},
      'PUT',
      configuration
    );
  },
};
