import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { Castle } from '../index';
import fetchMock from 'fetch-mock';
import { EVENTS } from '../src/events';
import sinon from 'sinon';

chai.use(chaiAsPromised);
const expect = chai.expect;

const sampleRequestData = {
  event: EVENTS.EMAIL_CHANGE_SUCCEEDED,
  created_at: 'now',
  user_id: 'userid',
  user_traits: {
    email: 'myemail',
    registered_at: 'today',
  },
  context: {
    ip: '8.8.8.8',
    client_id: 'clientid',
    headers: {
      Cookie: 'SECRET=pleasedontbehere',
    },
  },
};

describe('Castle', () => {
  it('should have some public methods', () => {
    const castle = new Castle({ apiSecret: 'some secret' });
    expect(castle).to.have.property('authenticate');
    expect(castle).to.have.property('track');
  });

  it('should throw if API secret is missing', () => {
    // @ts-ignore
    const castleFactory = () => new Castle({});
    expect(castleFactory).to.throw();
  });

  describe('track', () => {
    it('should make a network request with some basic information', () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().post('*', 204);
      const clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
      });
      castle.track(sampleRequestData);

      const lastOptions = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).to.have.property('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).to.have.property('event', sampleRequestData.event);
      expect(payload).to.have.property(
        'created_at',
        sampleRequestData.created_at
      );
      expect(payload).to.have.property('event', sampleRequestData.event);
      expect(payload).to.have.property('user_id', sampleRequestData.user_id);
      expect(payload).to.have.property('user_traits');
      expect(payload.user_traits).to.have.property(
        'email',
        sampleRequestData.user_traits.email
      );
      expect(payload.user_traits).to.have.property(
        'registered_at',
        sampleRequestData.user_traits.registered_at
      );
      expect(payload).to.have.property('context');
      expect(payload.context).to.have.property(
        'ip',
        sampleRequestData.context.ip
      );
      expect(payload.context).to.have.property(
        'client_id',
        sampleRequestData.context.client_id
      );
      expect(payload.context).to.have.property('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).to.have.property('Cookie', true);

      clock.restore();
    });

    it('should only allow whitelisted headers', () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().post('*', 204);

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        allowedHeaders: ['X-NOT-A-SECRET'],
      });

      castle.track({
        ...sampleRequestData,
        context: {
          ...sampleRequestData.context,
          headers: {
            'X-NOT-A-SECRET': 'not secret!',
            'X-SUPER-SECRET': 'so secret!',
          },
        },
      });

      const lastOptions = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());

      expect(payload).to.have.property('context');
      expect(payload.context).to.have.property('headers');
      expect(payload.context.headers).to.have.property(
        'X-NOT-A-SECRET',
        'not secret!'
      );
      expect(payload.context.headers).to.have.property('X-SUPER-SECRET', true);
    });

    it('should not allow blacklisted headers', () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().post('*', 204);

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        disallowedHeaders: ['X-SUPER-SECRET'],
      });

      castle.track({
        ...sampleRequestData,
        context: {
          ...sampleRequestData.context,
          headers: {
            'X-NOT-A-SECRET': 'not secret!',
            'X-SUPER-SECRET': 'so secret!',
          },
        },
      });

      const lastOptions = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());

      expect(payload).to.have.property('context');
      expect(payload.context).to.have.property('headers');
      expect(payload.context.headers).to.have.property(
        'X-NOT-A-SECRET',
        'not secret!'
      );
      expect(payload.context.headers).to.have.property('X-SUPER-SECRET', true);
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
      });

      expect(castle.track(sampleRequestData)).to.be.rejectedWith(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    });
  });

  describe('authenticate', () => {
    it('should make a network request with some basic information', async () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().mock(
        '*',
        // Mimic an allow response from authenticate.
        { action: 'allow', device_token: 'device_token', user_id: 'user_id' }
      );
      const clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
      });
      const response = await castle.authenticate(sampleRequestData);

      expect(response).to.have.property('action', 'allow');
      expect(response).to.have.property('device_token', 'device_token');
      expect(response).to.have.property('user_id', 'user_id');

      const lastOptions = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).to.have.property('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).to.have.property('event', sampleRequestData.event);
      expect(payload).to.have.property(
        'created_at',
        sampleRequestData.created_at
      );
      expect(payload).to.have.property('user_id', sampleRequestData.user_id);
      expect(payload).to.have.property('user_traits');
      expect(payload.user_traits).to.have.property(
        'email',
        sampleRequestData.user_traits.email
      );
      expect(payload.user_traits).to.have.property(
        'registered_at',
        sampleRequestData.user_traits.registered_at
      );
      expect(payload).to.have.property('context');
      expect(payload.context).to.have.property(
        'ip',
        sampleRequestData.context.ip
      );
      expect(payload.context).to.have.property(
        'client_id',
        sampleRequestData.context.client_id
      );
      expect(payload.context).to.have.property('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).to.have.property('Cookie', true);

      clock.restore();
    });

    it('should handle timeout', async () => {
      // Create a fake AbortError, which indicates a timeout.
      const abortError = new Error();
      abortError.name = 'AbortError';

      const fetch = fetchMock.sandbox().post('*', { throws: abortError });
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        failoverStrategy: 'deny',
      });

      const response = await castle.authenticate(sampleRequestData);
      expect(response).to.have.property('action', 'deny');
      expect(response).to.have.property('failover', true);
      expect(response).to.have.property('failover_reason', 'timeout');
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
      });

      expect(castle.authenticate(sampleRequestData)).to.be.rejectedWith(
        'Castle: Failed to authenticate with API, please verify the secret.'
      );
    });
  });
});
