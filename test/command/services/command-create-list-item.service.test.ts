import { CommandCreateListItemService } from '../../../src/command/command.module';
import { Configuration } from '../../../src/configuration';
import AbortController from 'abort-controller';
import { ListItemAuthorType, ListItemMode } from '../../../src/payload/models';
import MockDate from 'mockdate';
import { InvalidParametersError } from '../../../src/errors';

describe('CommandCreateListItem', () => {
  beforeEach(() => {
    MockDate.set(new Date('2023-04-15T00:00:00.000Z'));
  });

  afterEach(() => {
    MockDate.reset();
  });
  describe('call', () => {
    const controller = new AbortController();

    const options = {
      list_id: 'e6baae3a-0636-441a-ba4f-c73f266c7a17',
      primary_value: 'A04t7AcfSA69cBTTusx0RQ',
      secondary_value: '2ee938c8-24c2-4c26-9d25-19511dd75029',
      comment: 'Fradulent user found through automated inspection',
      author: {
        type: '$other' as ListItemAuthorType,
        identifier: 'Security bot',
      },
      mode: '$error' as ListItemMode,
    };

    const expected = {
      requestUrl: new URL(
        `https://castle.io/v1/lists/${options.list_id}/items`
      ),
      requestOptions: {
        signal: controller.signal,
        method: 'POST',
        headers: {
          Authorization: 'Basic OnRlc3Q=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sent_at: '2023-04-15T00:00:00.000Z',
          ...options,
        }),
      },
    };

    const config = new Configuration({
      apiSecret: 'test',
      baseUrl: 'https://castle.io/v1',
    });

    it('generates payload', () => {
      const received = CommandCreateListItemService.call(
        controller,
        options,
        config
      );
      expect(received.requestUrl.href).toEqual(expected.requestUrl.href);
      expect(received).toMatchObject(expected);
    });

    test.each(['list_id', 'primary_value', 'author'])(
      'throws if %s is missing from the payload',
      (prop) => {
        const invalidOptions = Object.assign({}, options);
        delete invalidOptions[prop];
        expect(() =>
          CommandCreateListItemService.call(controller, invalidOptions, config)
        ).toThrow(InvalidParametersError);
      }
    );
  });
});
