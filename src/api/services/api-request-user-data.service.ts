import { Configuration } from '../../configuration';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import { RequestUserDataPayload } from '../../payload/models/privacy_payload';
import { CommandRequestUserDataService } from '../../command/services/command-request-user-data.service';

export const APIRequestUserDataService = {
  call: async (
    options: RequestUserDataPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandRequestUserDataService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
