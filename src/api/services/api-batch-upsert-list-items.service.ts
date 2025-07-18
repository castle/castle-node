import { Configuration } from '../../configuration';
import { CommandBatchUpsertListItemsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import type { BatchUpsertListItemsPayload } from '../../payload/models';

export const APIBatchUpsertListItemsService = {
  call: async (
    options: BatchUpsertListItemsPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandBatchUpsertListItemsService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
