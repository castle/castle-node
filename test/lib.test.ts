import { expect } from 'chai';
import { Castle } from '../index';
import fetchMock from 'fetch-mock';
import { EVENTS } from '../src/events';
import sinon from 'sinon';

// event: string;
// user_id: string;
// user_traits: any;
// context: {
//   ip: string;
//   client_id: string;
//   headers: IncomingHttpHeaders;
// };

describe('Castle', () => {
  it('should have some public methods', () => {
    const castle = new Castle({ apiSecret: 'some secret' });
    expect(castle).to.have.property('authenticate');
    expect(castle).to.have.property('track');
  });

  describe('track', () => {
    it('should make a network request with some basic information', () => {
      const fetch = fetchMock.post('*', 204).sandbox();
      const clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());

      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
      });
      const requestData = {
        event: EVENTS.EMAIL_CHANGE_SUCCEEDED,
        user_id: 'userid',
        user_traits: {
          email: 'myemail',
          registered_at: 'today',
        },
        context: {
          ip: '8.8.8.8',
          client_id: 'clientid',
          headers: {
            cookie: 'SECRET=pleasedontbehere',
          },
        },
      };
      castle.track(requestData);

      const lastOptions = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).to.have.property('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).to.have.property('event', requestData.event);
      expect(payload).to.have.property('user_id', requestData.user_id);
      expect(payload).to.have.property('user_traits');
      expect(payload.user_traits).to.have.property(
        'email',
        requestData.user_traits.email
      );
      expect(payload.user_traits).to.have.property(
        'registered_at',
        requestData.user_traits.registered_at
      );
      expect(payload).to.have.property('context');
      expect(payload.context).to.have.property('ip', requestData.context.ip);
      expect(payload.context).to.have.property(
        'client_id',
        requestData.context.client_id
      );
      expect(payload.context).to.have.property('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).to.have.property('cookie', true);

      clock.restore();
    });
  });
});
