import { SecureModeService } from '../../../src/secure-mode/secure-mode.module';
import { Configuration } from '../../../src/configuration';

describe('SecureModeService', () => {
  describe('call', () => {
    it('computes a hex HMAC-SHA256 signature of the user id', () => {
      const configuration = new Configuration({ apiSecret: 'secret' });

      expect(SecureModeService.call('test', configuration)).toEqual(
        '0329a06b62cd16b33eb6792be8c60b158d89a2ee3a876fce9a881ebb488c0914'
      );
    });
  });
});
