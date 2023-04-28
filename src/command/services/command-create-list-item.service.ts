import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import { ListItemPayload } from '../../payload/models/list_item_payload';

export const CommandCreateListItemService = {
  call: (
    controller,
    options: ListItemPayload,
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
