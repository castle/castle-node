import { ValidatorPresentService } from '../../../src/validator/validator.module';
import { InvalidParametersError } from '../../../src/errors';

describe('ValidatorPresentService', () => {
  describe('call', () => {
    const obj = { first: 'here', fourth: '' };
    describe('when keys are not present', () => {
      const keys = ['second', 'third'];

      it('throws error', () => {
        expect(() => ValidatorPresentService.call(obj, keys)).toThrow(
          InvalidParametersError
        );
      });
    });

    describe('when key is empty', () => {
      const keys = ['fourth'];

      it('throws error', () => {
        expect(() => ValidatorPresentService.call(obj, keys)).toThrow(
          InvalidParametersError
        );
      });
    });

    describe('when key is defined', () => {
      const keys = ['first'];

      it('does not throw error', () => {
        expect(() => ValidatorPresentService.call(obj, keys)).not.toThrow(
          InvalidParametersError
        );
      });
    });
  });
});
