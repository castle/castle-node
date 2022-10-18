import { Castle } from '../index';
import fetchMock from 'fetch-mock';
import { FailoverStrategy } from '../src/failover/models';
import MockDate from 'mockdate';
import { HeadersExtractService } from '../src/headers/headers.module';

const sampleRequestData = (configuration) => {
  return {
    event: '$login.succeeded',
    created_at: 'now',
    user_id: 'userid',
    user_traits: {
      email: 'myemail',
      registered_at: 'today',
    },
    context: {
      ip: '8.8.8.8',
      client_id: 'clientid',
      headers: HeadersExtractService.call(
        {
          Cookie: 'SECRET=pleasedontbehere',
          'x-forwarded-for': '8.8.8.8',
        },
        configuration
      ),
    },
  };
};

const sampleRiskRequestData = (configuration) => {
  return {
    event: '$login',
    request_token: 'token',
    status: '$succeeded',
    user: {
      id: 'userid',
      email: 'email',
      traits: {
        registered_at: 'today',
      },
    },
    context: {
      ip: '8.8.8.8',
      client_id: 'clientid',
      headers: HeadersExtractService.call(
        {
          Cookie: 'SECRET=pleasedontbehere',
          'x-forwarded-for': '8.8.8.8',
        },
        configuration
      ),
    },
  };
};

const sampleFilterRequestData = (configuration) => {
  return {
    event: '$login',
    request_token: 'token',
    status: '$succeeded',
    user: {
      id: 'userid',
      email: 'email',
      traits: {
        registered_at: 'today',
      },
    },
    context: {
      ip: '8.8.8.8',
      client_id: 'clientid',
      headers: HeadersExtractService.call(
        {
          Cookie: 'SECRET=pleasedontbehere',
          'x-forwarded-for': '8.8.8.8',
        },
        configuration
      ),
    },
  };
};

const sampleLogRequestData = (configuration) => {
  return {
    event: '$login',
    status: '$succeeded',
    user: {
      id: 'userid',
      email: 'email',
      traits: {
        email: 'myemail',
        registered_at: 'today',
      },
    },
    context: {
      ip: '8.8.8.8',
      client_id: 'clientid',
      headers: HeadersExtractService.call(
        {
          Cookie: 'SECRET=pleasedontbehere',
          'x-forwarded-for': '8.8.8.8',
        },
        configuration
      ),
    },
  };
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
    beforeEach(() => {
      MockDate.set(new Date(2011, 9, 1));
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should make a network request with some basic information', () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().post('*', 204);

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      castle.track(sampleRequestDataLocal);

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleRequestDataLocal.event);
      expect(payload).toHaveProperty(
        'created_at',
        sampleRequestDataLocal.created_at
      );
      expect(payload).toHaveProperty('user_id', sampleRequestDataLocal.user_id);
      expect(payload).toHaveProperty('user_traits');
      expect(payload.user_traits).toHaveProperty(
        'email',
        sampleRequestDataLocal.user_traits.email
      );
      expect(payload.user_traits).toHaveProperty(
        'registered_at',
        sampleRequestDataLocal.user_traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleRequestDataLocal.context.ip
      );
      expect(payload.context).toHaveProperty(
        'client_id',
        sampleRequestDataLocal.context.client_id
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
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
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);

      castle.track({
        ...sampleRequestDataLocal,
        context: {
          ...sampleRequestDataLocal.context,
          headers: HeadersExtractService.call(
            {
              'X-NOT-A-SECRET': 'not secret!',
              'X-SUPER-SECRET': 'so secret!',
            },
            castle.configuration
          ),
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
        allowlisted: ['X-NOT-A-SECRET'],
        denylisted: ['X-SUPER-SECRET'],
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);

      castle.track({
        ...sampleRequestDataLocal,
        context: {
          ...sampleRequestDataLocal.context,
          headers: HeadersExtractService.call(
            {
              'X-NOT-A-SECRET': 'not secret!',
              'X-SUPER-SECRET': 'so secret!',
            },
            castle.configuration
          ),
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
        failoverStrategy: FailoverStrategy.deny,
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);

      await castle.track(sampleRequestDataLocal);

      // Ensure that fetch was never called. When do not track
      // is on, the SDK should generate no outbound requests.
      // eslint:disable-next-line:no-unused-expression
      expect(fetch.called()).toBeFalsy;
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);

      // Promise based expectations have to be awaited to properly fail
      // tests, instead of just logging unhandled rejections.
      await expect(
        castle.authenticate(sampleRequestDataLocal)
      ).rejects.toThrowError('Castle: Responded with 401 code');
    });
  });

  describe('authenticate', () => {
    beforeEach(() => {
      MockDate.set(new Date(2011, 9, 1));
    });

    afterEach(() => {
      MockDate.reset();
    });
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
          policy: {
            id: 'q-rbeMzBTdW2Fd09sbz55A',
            revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
            name: 'Block Users from X',
          },
        }
      );
      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      const response = await castle.authenticate(sampleRequestDataLocal);
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device_token', 'device_token');
      expect(response).toHaveProperty('user_id', 'user_id');
      expect(response.policy).toHaveProperty('id', 'q-rbeMzBTdW2Fd09sbz55A');
      expect(response.policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.policy).toHaveProperty('name', 'Block Users from X');

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleRequestDataLocal.event);
      expect(payload).toHaveProperty(
        'created_at',
        sampleRequestDataLocal.created_at
      );
      expect(payload).toHaveProperty('user_id', sampleRequestDataLocal.user_id);
      expect(payload).toHaveProperty('user_traits');
      expect(payload.user_traits).toHaveProperty(
        'email',
        sampleRequestDataLocal.user_traits.email
      );
      expect(payload.user_traits).toHaveProperty(
        'registered_at',
        sampleRequestDataLocal.user_traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleRequestDataLocal.context.ip
      );
      expect(payload.context).toHaveProperty(
        'client_id',
        sampleRequestDataLocal.context.client_id
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
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
        failoverStrategy: FailoverStrategy.deny,
        logger: { info: () => {} },
      });
      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      const response = await castle.authenticate(sampleRequestDataLocal);
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
        failoverStrategy: FailoverStrategy.deny,
        logger: { info: () => {} },
      });
      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      const response = await castle.authenticate(sampleRequestDataLocal);
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
        failoverStrategy: FailoverStrategy.deny,
        logger: { info: () => {} },
      });
      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      const response = await castle.authenticate(sampleRequestDataLocal);
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('failover', true);
      expect(response).toHaveProperty('failover_reason', 'do not track');
      expect(response).toHaveProperty('user_id', 'userid');

      // Ensure that fetch was never called. When do not track
      // is on, the SDK should generate no outbound requests.
      // eslint:disable-next-line:no-unused-expression
      expect(fetch.called()).toBeFalsy;
    });

    it('should fail on unauthorized', async () => {
      const fetch = fetchMock.sandbox().post('*', 401);
      const castle = new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });
      const sampleRequestDataLocal = sampleRequestData(castle.configuration);
      // Promise based expectations have to be awaited to properly fail
      // tests, instead of just logging unhandled rejections.
      await expect(
        castle.authenticate(sampleRequestDataLocal)
      ).rejects.toThrowError('Castle: Responded with 401 code');
    });
  });

  describe('risk', () => {
    beforeEach(() => {
      MockDate.set(new Date(2011, 9, 1));
    });

    afterEach(() => {
      MockDate.reset();
    });
    it('should make a network request with some basic information', async () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().mock(
        '*',
        // Mimic an allow response from authenticate.
        {
          action: 'allow',
          device: { token: 'device_token' },
          policy: {
            id: 'q-rbeMzBTdW2Fd09sbz55A',
            revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
            name: 'Block Users from X',
          },
        }
      );
      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const sampleRiskRequestDataLocal = sampleRiskRequestData(
        castle.configuration
      );
      const response = await (<any>castle.risk(sampleRiskRequestDataLocal));
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device.token', 'device_token');
      expect(response.policy).toHaveProperty('id', 'q-rbeMzBTdW2Fd09sbz55A');
      expect(response.policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.policy).toHaveProperty('name', 'Block Users from X');

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleRiskRequestDataLocal.event);
      expect(payload).toHaveProperty(
        'user.id',
        sampleRiskRequestDataLocal.user.id
      );
      expect(payload).toHaveProperty('user.traits');
      expect(payload.user).toHaveProperty(
        'email',
        sampleRiskRequestDataLocal.user.email
      );
      expect(payload.user.traits).toHaveProperty(
        'registered_at',
        sampleRiskRequestDataLocal.user.traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleRiskRequestDataLocal.context.ip
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
    });
  });

  describe('filter', () => {
    beforeEach(() => {
      MockDate.set(new Date(2011, 9, 1));
    });

    afterEach(() => {
      MockDate.reset();
    });
    it('should make a network request with some basic information', async () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().mock(
        '*',
        // Mimic an allow response from authenticate.
        {
          action: 'allow',
          device: { token: 'device_token' },
          policy: {
            id: 'q-rbeMzBTdW2Fd09sbz55A',
            revision_id: 'pke4zqO2TnqVr-NHJOAHEg',
            name: 'Block Users from X',
          },
        }
      );
      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const sampleFilterRequestDataLocal = sampleFilterRequestData(
        castle.configuration
      );
      const response = await (<any>castle.filter(sampleFilterRequestDataLocal));
      expect(response).toHaveProperty('action', 'allow');
      expect(response).toHaveProperty('device.token', 'device_token');
      expect(response.policy).toHaveProperty('id', 'q-rbeMzBTdW2Fd09sbz55A');
      expect(response.policy).toHaveProperty(
        'revision_id',
        'pke4zqO2TnqVr-NHJOAHEg'
      );
      expect(response.policy).toHaveProperty('name', 'Block Users from X');

      const lastOptions: any = fetch.lastOptions();
      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty(
        'event',
        sampleFilterRequestDataLocal.event
      );
      expect(payload).toHaveProperty(
        'user.id',
        sampleFilterRequestDataLocal.user.id
      );
      expect(payload).toHaveProperty('user.traits');
      expect(payload.user).toHaveProperty(
        'email',
        sampleFilterRequestDataLocal.user.email
      );
      expect(payload.user.traits).toHaveProperty(
        'registered_at',
        sampleFilterRequestDataLocal.user.traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleFilterRequestDataLocal.context.ip
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
    });
  });

  describe('log', () => {
    beforeEach(() => {
      MockDate.set(new Date(2011, 9, 1));
    });

    afterEach(() => {
      MockDate.reset();
    });

    it('should make a network request with some basic information', () => {
      // Because we don't use a global fetch we have to create a
      // sandboxed instance of it here.
      const fetch = fetchMock.sandbox().post('*', 204);

      const castle = new Castle({
        apiSecret: 'some secret',
        // Pass the sandboxed instance to Castle constructor
        // using the optional property `overrideFetch`
        overrideFetch: fetch,
        logger: { info: () => {} },
      });
      const sampleLogRequestDataLocal = sampleLogRequestData(
        castle.configuration
      );
      castle.log(sampleLogRequestDataLocal);

      const lastOptions: any = fetch.lastOptions();

      const payload = JSON.parse(lastOptions.body.toString());
      // Ensure the client set the sent_at property.
      expect(payload).toHaveProperty('sent_at', new Date().toISOString());
      // Verify that the passed in properties are passed on.
      expect(payload).toHaveProperty('event', sampleLogRequestDataLocal.event);
      expect(payload).toHaveProperty(
        'user.id',
        sampleLogRequestDataLocal.user.id
      );
      expect(payload).toHaveProperty('user.traits');
      expect(payload.user).toHaveProperty(
        'email',
        sampleLogRequestDataLocal.user.email
      );
      expect(payload.user.traits).toHaveProperty(
        'registered_at',
        sampleLogRequestDataLocal.user.traits.registered_at
      );
      expect(payload).toHaveProperty('context');
      expect(payload.context).toHaveProperty(
        'ip',
        sampleLogRequestDataLocal.context.ip
      );
      expect(payload.context).toHaveProperty(
        'client_id',
        sampleLogRequestDataLocal.context.client_id
      );
      expect(payload.context).toHaveProperty('headers');
      // Ensure that cookie header property is scrubbed.
      expect(payload.context.headers).toHaveProperty('Cookie', true);
    });
  });
});
