import { ContextSanitizeService } from '../../../src/context/context.module';

describe('ContextSanitizeService', () => {
  describe('call', () => {
    const payload = {
      test: 'test',
    };

    describe('when active true', () => {
      it('returns full context', () => {
        const expected = { ...payload, ...{ active: true } };
        const result = ContextSanitizeService.call(expected);
        expect(result).toMatchObject(expected);
      });
    });

    describe('when active false', () => {
      it('returns full context', () => {
        const expected = { ...payload, ...{ active: false } };
        const result = ContextSanitizeService.call(expected);
        expect(result).toMatchObject(expected);
      });
    });

    describe('when active is not boolean', () => {
      it('returns only payload', () => {
        const result = ContextSanitizeService.call({
          ...payload,
          ...{ active: 'yes' },
        });
        expect(result).toMatchObject(payload);
      });
    });
  });
});
