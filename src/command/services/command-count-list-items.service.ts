import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { CountListItemsPayload } from '../../payload/models';

export const CommandCountListItemsService = {
  call: (
    controller,
    options: CountListItemsPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items/count`,
      options,
      'POST',
      configuration
    );
  },
};
