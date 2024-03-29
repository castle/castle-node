import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { CreateListItemPayload } from '../../payload/models';

export const CommandCreateListItemService = {
  call: (
    controller,
    options: CreateListItemPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items`,
      options,
      'POST',
      configuration
    );
  },
};
