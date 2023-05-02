import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { SearchListItemsPayload } from '../../payload/models';

export const CommandSearchListItemsService = {
  call: (
    controller,
    options: SearchListItemsPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items/query`,
      options,
      'POST',
      configuration
    );
  },
};
