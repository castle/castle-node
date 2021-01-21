import { Castle } from '../index';
import fetchMock from 'fetch-mock';
import { EVENTS } from '../src/events';
import sinon from 'sinon';

const sampleRequestData = {
  event: EVENTS.LOGIN_SUCCEEDED,
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
    expect(castle).toHaveProperty('authenticate');
    expect(castle).toHaveProperty('track');
  });

  it('should throw if API secret is missing', () => {
    // @ts-ignore
    const castleFactory = () => new Castle({});
    expect(castleFactory).toThrow();
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

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleRequestData.event);
      expect(payload).toHaveProperty(
        'created_at',
        sampleRequestData.created_at
      );
      expect(payload).toHaveProperty('event', sampleRequestData.event);
      expect(payload).toHaveProperty('user_id', sampleRequestData.user_id);
      expect(payload).toHaveProperty('user_traits');
      expect(payload.user_traits).toHaveProperty(
        'email',
        sampleRequestData.user_traits.email
      );
      expect(payload.user_traits).toHaveProperty(
        'registered_at',
        sampleRequestData.user_traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleRequestData.context.ip
      );
      expect(payload.context).toHaveProperty(
        'client_id',
        sampleRequestData.context.client_id
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);

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
        allowlisted: ['X-NOT-A-SECRET'],
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

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());

      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty('headers');
      expect(payload.context.headers).toHaveProperty(
        'X-NOT-A-SECRET',
        'not secret!'
      );
      expect(payload.context.headers).toHaveProperty('X-SUPER-SECRET', true);
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
        denylisted: ['X-SUPER-SECRET'],
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

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());

      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty('headers');
      expect(payload.context.headers).toHaveProperty(
        'X-NOT-A-SECRET',
        'not secret!'
      );
      expect(payload.context.headers).toHaveProperty('X-SUPER-SECRET', true);
    });

    it('should not do requests when do not track is set', async () => {
      const fetch = fetchMock.sandbox().post('*', 500);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        doNotTrack: true,
        failoverStrategy: 'deny',
      });

      await castle.track(sampleRequestData);

      // Ensure that fetch was never called. When do not track
      // is on, the SDK should generate no outbound requests.
      // tslint:disable-next-line:no-unused-expression
      expect(fetch.called()).toBeFalsy;
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
      });

      // Promise based expectations have to be awaited to properly fail
      // tests, instead of just logging unhandled rejections.
      await expect(
        castle.authenticate(sampleRequestData)
      ).rejects.toMatchObject({
        message:
          'Castle: Failed to authenticate with API, please verify the secret.',
      });
    });
  });

  describe('authenticate', () => {
    it('should make a network request with some basic information', async () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().mock(
        '*',
        // Mimic an allow response from authenticate.
        {
          action: 'allow',
          device_token: 'device_token',
          user_id: 'user_id',
          risk_policy: {
            id: 'q-rbeMzBTdW2Fd09sbz55A',
            revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
            name: 'Block Users from X',
            type: 'bot',
          },
        }
      );
      const clock = sinon.useFakeTimers(new Date(2011, 9, 1).getTime());
      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
      });

      const response = await castle.authenticate(sampleRequestData);
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device_token', 'device_token');
      expect(response).toHaveProperty('user_id', 'user_id');
      expect(response.risk_policy).toHaveProperty(
        'id',
        'q-rbeMzBTdW2Fd09sbz55A'
      );
      expect(response.risk_policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.risk_policy).toHaveProperty('type', 'bot');
      expect(response.risk_policy).toHaveProperty('name', 'Block Users from X');

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleRequestData.event);
      expect(payload).toHaveProperty(
        'created_at',
        sampleRequestData.created_at
      );
      expect(payload).toHaveProperty('user_id', sampleRequestData.user_id);
      expect(payload).toHaveProperty('user_traits');
      expect(payload.user_traits).toHaveProperty(
        'email',
        sampleRequestData.user_traits.email
      );
      expect(payload.user_traits).toHaveProperty(
        'registered_at',
        sampleRequestData.user_traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleRequestData.context.ip
      );
      expect(payload.context).toHaveProperty(
        'client_id',
        sampleRequestData.context.client_id
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
      clock.restore();
    });

    it('should handle timeout', async () => {
      // Create a fake AbortError, which indicates a timeout.
      const abortError = new Error();
      abortError.name = 'AbortError';
      abortError.message = 'The request was aborted.';

      const fetch = fetchMock.sandbox().post('*', { throws: abortError });
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        failoverStrategy: 'deny',
        // This test causes an error level log event, so increase
        // logLevel to fatal to prevent clouding the test output.
        logLevel: 'fatal',
      });

      const response = await castle.authenticate(sampleRequestData);
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('failover', true);
      expect(response).toHaveProperty('failover_reason', 'timeout');
      expect(response).toHaveProperty('user_id', 'userid');
    });

    it('should failover on 500', async () => {
      const fetch = fetchMock.sandbox().post('*', 500);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        failoverStrategy: 'deny',
        // This test causes an error level log event, so increase
        // logLevel to fatal to prevent clouding the test output.
        logLevel: 'fatal',
      });

      const response = await castle.authenticate(sampleRequestData);
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('failover', true);
      expect(response).toHaveProperty('failover_reason', 'server error');
      expect(response).toHaveProperty('user_id', 'userid');
    });

    it('should failover when do not track is set', async () => {
      const fetch = fetchMock.sandbox().post('*', 500);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        doNotTrack: true,
        failoverStrategy: 'deny',
      });

      const response = await castle.authenticate(sampleRequestData);
      expect(response).toHaveProperty('action', 'deny');
      expect(response).toHaveProperty('failover', true);
      expect(response).toHaveProperty('failover_reason', 'do not track');
      expect(response).toHaveProperty('user_id', 'userid');

      // Ensure that fetch was never called. When do not track
      // is on, the SDK should generate no outbound requests.
      // tslint:disable-next-line:no-unused-expression
      expect(fetch.called()).toBeFalsy;
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
      });

      // Promise based expectations have to be awaited to properly fail
      // tests, instead of just logging unhandled rejections.
      await expect(
        castle.authenticate(sampleRequestData)
      ).rejects.toMatchObject({
        message:
          'Castle: Failed to authenticate with API, please verify the secret.',
      });
    });
  });
});
