import { Configuration } from '../../configuration';
import { CommandGenerateService } from './command-generate.service';
import { ValidatorPresentService } from '../../validator/validator.module';
import type { BatchUpsertListItemsPayload } from '../../payload/models';

export const CommandBatchUpsertListItemsService = {
  call: (
    controller,
    options: BatchUpsertListItemsPayload,
    configuration: Configuration
  ) => {
    ValidatorPresentService.call(options, ['list_id']);

    return CommandGenerateService.call(
      controller,
      `lists/${options.list_id}/items/batch`,
      options,
      'POST',
      configuration
    );
  },
};
