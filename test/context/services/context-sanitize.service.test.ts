import { ContextSanitize } from '../../../src/context/context.module';

describe('ContextSanitize', () => {
  describe('call', () => {
    const payload = {
      test: 'test',
    };

    describe('when active true', () => {
      it('returns full context', () => {
        const expected = { ...payload, ...{ active: true } };
        const result = ContextSanitize.call(expected);
        expect(result).toMatchObject(expected);
      });
    });

    describe('when active false', () => {
      it('returns full context', () => {
        const expected = { ...payload, ...{ active: false } };
        const result = ContextSanitize.call(expected);
        expect(result).toMatchObject(expected);
      });
    });

    describe('when active is not boolean', () => {
      it('returns only payload', () => {
        const result = ContextSanitize.call({
          ...payload,
          ...{ active: 'yes' },
        });
        expect(result).toMatchObject(payload);
      });
    });
  });
});
