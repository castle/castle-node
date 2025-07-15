import { APISearchEventsService } from '../../../src/api/api.module';
import { Configuration } from '../../../src/configuration';
import fetchMock from 'fetch-mock';
import {
  EventAuthenticationMethod,
  SearchEventsQueryFilterOperator,
  SearchEventsQueryType,
  EventSignal,
  SearchEventsResponse,
} from '../../../src/payload/models';

describe('APISearchEventsService', () => {
  const sampleRequestData = {
    filters: [
      {
        field: 'user.email',
        op: '$eq' as SearchEventsQueryFilterOperator,
        value: 'user@example.org',
      },
    ],
    query_type: '$records_with_count' as SearchEventsQueryType,
    page: 1,
    results_size: 1,
  };

  describe('call', () => {
    it('handles search events response', async () => {
      // Should probably be moved to a mocks file
      const apiResponse: SearchEventsResponse = {
        data: [
          {
            id: 'ASZoelALT5-PaVw2pAVMXg',
            type: '$login',
            status: '$succeeded',
            risk: 0.396,
            signals: [
              'bot_behavior' as EventSignal,
              'multiple_accounts_per_device' as EventSignal,
            ],
            properties: {},
            product: {
              id: 'string',
            },
            device: {
              user_agent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
              fingerprint: 'ohvjn8adSnetYTzZ8B7bOP',
              hardware: {
                type: 'computer',
                name: null,
                brand: null,
                display: {
                  width: 1512,
                  height: 982,
                },
                model: {
                  name: null,
                  code: null,
                },
              },
              os: {
                name: 'Windows 10',
                version: {
                  major: '10',
                  full: null,
                },
              },
              software: {
                type: 'browser',
                name: 'Chrome',
                languages: ['en-us', 'en'],
                version: {
                  major: '91',
                  full: '91.0.4472',
                },
                fingerprint: 'vOch_0a_fpkl1Tf-pVPuDA',
              },
              timezone: {
                offset: -300,
                name: 'America/New_York',
              },
              screen: {
                screen: 2,
                orientation: 'landscape',
              },
            },
            ip: {
              asn: 14618,
              location: {
                city: 'Ashburn',
                continent_code: 'NA',
                country_code: 'US',
                postal_code: '20149',
                region_code: 'VA',
                latitude: 52.3583,
                longitude: 4.8488,
              },
              address: '34.200.81.5',
              isp: {
                name: 'verizon fios',
                organization: 'verizon fios',
              },
              type: 'ipv4',
              privacy: {
                anonymous: false,
                datacenter: false,
                proxy: false,
                tor: false,
              },
            },
            policy: {
              name: 'Challenge risk >= 60',
              id: '2ee938c8-24c2-4c26-9d25-19511dd75029',
              revision_id: '900b183a-9f6d-4579-8c47-9ddcccf637b4',
              action: 'challenge',
              response: {
                status_code: 403,
                body: 'Access denied',
                headers: [
                  {
                    name: 'X-Custom-Header',
                    value: '1234567890',
                  },
                ],
              },
            },
            user: {
              id: '220f785c-77a4-4532-ba23-f7e68388eebe',
              registered_at: '2010-12-02T00:30:08.276Z',
              last_seen_at: '2021-12-02T03:40:03.226Z',
              risk: 0.396,
              devices_count: 2,
              name: 'Rhea Franecki',
              email: 'Rhea.Franecki+subaddress@example.org',
              phone: '+16175551212',
              traits: {
                organization_name: 'Example Org',
                account_verified_at: '2024-07-25T13:22:50.834Z',
              },
              address: {
                line1: '60 Rausch Street',
                line2: 'string',
                city: 'San Francisco',
                country_code: 'US',
                region_code: 'CA',
                postal_code: '94103',
                fingerprint: '8a33j2lir9',
              },
            },
            params: {
              email: 'Rhea.Franecki@example.org',
              phone: '+16175551212',
              username: 'superhero123',
            },
            transaction: {
              type: '$purchase',
              id: '900b183a-9f6d-4579-8c47-9ddcccf637b4',
              base_amount: '499.99',
              amount: {
                type: '$fiat',
                value: '499.99',
                currency: 'USD',
              },
              payment_method: {
                type: '$aba',
                fingerprint: 'string',
                holder_name: 'string',
                bank_name: 'string',
                country_code: 'str',
                billing_address: {
                  line1: '60 Rausch Street',
                  line2: 'string',
                  city: 'San Francisco',
                  country_code: 'US',
                  region_code: 'CA',
                  postal_code: '94103',
                  fingerprint: '8a33j2lir9',
                },
                card: {
                  bin: 'string',
                  last4: 'string',
                  exp_month: 1,
                  exp_year: 2000,
                  network: '$amex',
                  funding: '$credit',
                },
              },
              shipping_address: {
                line1: '60 Rausch Street',
                line2: 'string',
                city: 'San Francisco',
                country_code: 'US',
                region_code: 'CA',
                postal_code: '94103',
                fingerprint: '8a33j2lir9',
              },
              merchant: {
                id: 'a2c8e7ef-40da-42f2-9b7d-cd928e5f8279',
                name: 'United Airlines',
                category: {
                  code: '3000',
                  description: 'Airlines',
                },
                address: {
                  line1: '60 Rausch Street',
                  line2: 'string',
                  city: 'San Francisco',
                  country_code: 'US',
                  region_code: 'CA',
                  postal_code: '94103',
                  fingerprint: '8a33j2lir9',
                },
              },
            },
            authentication_method: {
              type: '$social' as EventAuthenticationMethod,
              variant: 'facebook',
            },
            page: {
              name: 'string',
              url: 'string',
              referrer: 'string',
            },
            screen: {
              name: 'string',
            },
            scores: {
              account_sharing: {
                score: 0.396,
              },
              account_takeover: {
                score: 0.396,
              },
              bot: {
                score: 0.396,
              },
              multi_accounting: {
                score: 0.396,
              },
              spoofed_device: {
                score: 0.396,
              },
              spoofed_location: {
                score: 0.396,
              },
              unified: {
                score: 0.396,
              },
            },
            changeset: {
              property1: {
                changed: true,
              },
              property2: {
                changed: true,
              },
            },
            created_at: '2021-09-27T16:46:38.313Z',
          },
        ],
        total_count: 1,
      };

      const fetch = fetchMock.sandbox().mock(
        {
          url: `path:/v1/events/query`,
          method: 'POST',
        },
        apiResponse
      );
      const config = new Configuration({
        apiSecret: 'test',
        overrideFetch: fetch,
        logger: { info: () => {} },
      });

      const response = await APISearchEventsService.call(
        sampleRequestData,
        config
      );
      expect(response).toEqual(apiResponse);
    });
  });
});
