import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { ListItemPayload } from '../../payload/models';

export const CommandFetchListItemService = {
  call: (
    controller,
    options: ListItemPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['id', 'list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items/${options.id}`,
      {},
      'GET',
      configuration
    );
  },
};
