import { Configuration } from '../../configuration';
import { CommandFetchAllListsService } from '../../command/command.module';
import { APIService } from './api.service';
import AbortController from 'abort-controller';

export const APIFetchAllListsService = {
  call: async (configuration: Configuration): Promise<any> => {
    const controller = new AbortController();
    const command = CommandFetchAllListsService.call(controller, configuration);

    return APIService.call(controller, command, configuration);
  },
};
