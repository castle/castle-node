import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { DevicePayload } from '../../payload/payload.module';
import { ValidatorPresentService } from '../../validator/validator.module';

export const CommandReportDeviceService = {
  call: (controller, options: DevicePayload, configuration: Configuration) => {
    ValidatorPresentService.call(options, ['device_token']);

    return CommandGenerateService.call(
      controller,
      `devices/${options.device_token}/report`,
      {},
      'PUT',
      configuration
    );
  },
};
