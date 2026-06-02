import { Castle } from '../src/index';
import fetchMock from 'fetch-mock';
import MockDate from 'mockdate';
import { HeadersExtractService } from '../src/headers/headers.module';

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
    transaction: {
      id: 'txn_1',
      type: '$transfer',
      base_amount: '1000',
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
    expect(castle).toHaveProperty('risk');
    expect(castle).toHaveProperty('filter');
    expect(castle).toHaveProperty('log');
  });

  it('should throw if API secret is missing', () => {
    // @ts-ignore
    const castleFactory = () => new Castle({});
    expect(castleFactory).toThrow();
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
        'transaction.id',
        sampleRiskRequestDataLocal.transaction.id
      );
      expect(payload).toHaveProperty('transaction.base_amount', '1000');
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

  describe('events', () => {
    const buildCastle = (fetch) =>
      new Castle({
        apiSecret: 'some secret',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

    it('queryEvents posts to events/query', async () => {
      const fetch = fetchMock
        .sandbox()
        .mock(
          { url: 'path:/v1/events/query', method: 'POST' },
          { data: [], total_count: 0 }
        );

      const response = await buildCastle(fetch).queryEvents({ filters: [] });

      expect(response).toEqual({ data: [], total_count: 0 });
    });

    it('searchEvents is an alias of queryEvents', async () => {
      const fetch = fetchMock
        .sandbox()
        .mock(
          { url: 'path:/v1/events/query', method: 'POST' },
          { data: [], total_count: 0 }
        );

      const response = await buildCastle(fetch).searchEvents({ filters: [] });

      expect(response).toEqual({ data: [], total_count: 0 });
    });

    it('eventsSchema gets events/schema', async () => {
      const fetch = fetchMock
        .sandbox()
        .mock({ url: 'path:/v1/events/schema', method: 'GET' }, { data: [] });

      const response = await buildCastle(fetch).eventsSchema();

      expect(response).toEqual({ data: [] });
    });

    it('getEventsSchema is an alias of eventsSchema', async () => {
      const fetch = fetchMock
        .sandbox()
        .mock({ url: 'path:/v1/events/schema', method: 'GET' }, { data: [] });

      const response = await buildCastle(fetch).getEventsSchema();

      expect(response).toEqual({ data: [] });
    });

    it('groupEvents posts to events/group', async () => {
      const fetch = fetchMock
        .sandbox()
        .mock({ url: 'path:/v1/events/group', method: 'POST' }, { data: [] });

      const response = await buildCastle(fetch).groupEvents({
        filters: [],
        group_by: { fields: [] },
        columns: [],
      });

      expect(response).toEqual({ data: [] });
    });
  });
});
