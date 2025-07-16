import { Configuration } from '../../configuration';
import { APIService } from './api.service';
import AbortController from 'abort-controller';
import { DeleteUserDataPayload } from '../../payload/models/privacy_payload';
import { CommandDeleteUserDataService } from '../../command/services/command-delete-user-data.service';

export const APIDeleteUserDataService = {
  call: async (
    options: DeleteUserDataPayload,
    configuration: Configuration
  ): Promise<any> => {
    const controller = new AbortController();
    const command = CommandDeleteUserDataService.call(
      controller,
      options,
      configuration
    );

    return APIService.call(controller, command, configuration);
  },
};
