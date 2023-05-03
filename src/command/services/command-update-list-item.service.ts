import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { UpdateListItemPayload } from '../../payload/models';

export const CommandUpdateListItemService = {
  call: (
    controller,
    options: UpdateListItemPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['id', 'list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items/${options.id}`,
      options,
      'PUT',
      configuration
    );
  },
};
