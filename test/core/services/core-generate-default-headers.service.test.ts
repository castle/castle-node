import { CoreGenerateDefaultHeadersService } from '../../../src/core/core.module';
import { Configuration } from '../../../src/configuration';

describe('CoreGenerateDefaultHeadersService', () => {
  describe('call', () => {
    const result = {
      Authorization: 'Basic OnRlc3Q=',
      'Content-Type': 'application/json',
    };

    const config = new Configuration({
      apiSecret: 'test',
    });

    it('generates default headers', () => {
      expect(CoreGenerateDefaultHeadersService.call(config)).toMatchObject(
        result
      );
    });
  });
});
