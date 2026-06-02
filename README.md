# Castle SDK for Node

[![Test](https://github.com/castle/castle-node/actions/workflows/test.yml/badge.svg)](https://github.com/castle/castle-node/actions/workflows/test.yml)
[![Lint](https://github.com/castle/castle-node/actions/workflows/lint.yml/badge.svg)](https://github.com/castle/castle-node/actions/workflows/lint.yml)
[![npm version](https://img.shields.io/npm/v/@castleio/sdk.svg)](https://www.npmjs.com/package/@castleio/sdk)

The official Node.js SDK for [Castle](https://castle.io). Castle analyzes user behavior in web and mobile apps to stop fraud before it happens.

This package is a thin, dependency-light wrapper around the [Castle HTTP API](https://reference.castle.io). It exposes:

- **Risk assessment** — `POST /v1/risk`, `POST /v1/filter`
- **Event logging** — `POST /v1/log` (fire-and-forget, no verdict)
- **Lists & List Items** — full CRUD + search + count + batch
- **Privacy / GDPR** — `POST` and `DELETE /v1/privacy/users` (Article 15 & 17)
- **Events** (enterprise) — search, group, and schema
- **Webhook signature verification** — validate `X-Castle-Signature`
- **Secure mode** — sign user IDs sent from the browser

A full list of supported events and the JSON shape of every payload is documented at <https://reference.castle.io>.

## Requirements

- Node.js `>= 20` (the SDK uses the built-in global `fetch` / `AbortSignal`)
- A [Castle](https://dashboard.castle.io) API secret

The package ships both ESM and CommonJS builds, so both `import` and `require` work out of the box.

## Installation

```bash
npm install --save @castleio/sdk
```

```bash
yarn add @castleio/sdk
```

## Quick start

```js
import { Castle, ContextPrepareService } from '@castleio/sdk';

const castle = new Castle({ apiSecret: process.env.CASTLE_API_SECRET });

const context = ContextPrepareService.call(
  req,
  { cookies: req.cookies },
  castle.configuration
);

const verdict = await castle.risk({
  type: '$login',
  status: '$succeeded',
  request_token: req.body.castle_request_token,
  user: { id: '12345', email: 'user@example.com' },
  context,
});

switch (verdict.policy?.action) {
  case 'deny':
    // block the user
    break;
  case 'challenge':
    // send 2FA / additional verification
    break;
  default:
  // allow
}
```

With CommonJS:

```js
const { Castle, ContextPrepareService } = require('@castleio/sdk');
```

`ContextPrepareService.call(request, options, configuration)` extracts the IP, headers, and client id that Castle needs from a Node `request` object. See [Advanced configuration](#advanced-configuration) for how header allow/deny lists and proxy chains are resolved.

## Configuration

The library is configured per `Castle` instance:

```js
import { Castle, FailoverStrategy } from '@castleio/sdk';

const castle = new Castle({
  apiSecret: process.env.CASTLE_API_SECRET,

  // Automatic verdict from `risk`/`filter` when Castle is unreachable or
  // times out. One of FailoverStrategy.allow (default), .deny, .challenge.
  failoverStrategy: FailoverStrategy.allow,

  // Request timeout in milliseconds before the failover strategy kicks in.
  timeout: 1500,

  // Logs Castle API requests and responses; must respond to `info`.
  logger: console,
});
```

### Config options

| Option              | Type               | Default                    | Description                                                                                                     |
| ------------------- | ------------------ | -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `apiSecret`         | `string`           |                            | API secret from the [dashboard](https://dashboard.castle.io/settings/general).                                  |
| `timeout`           | `number`           | `1500`                     | Time in ms before returning the failover strategy.                                                              |
| `failoverStrategy`  | `FailoverStrategy` | `FailoverStrategy.allow`   | Automatic `risk` response on timeout: `allow`, `deny`, or `challenge`.                                          |
| `logger`            | `object`           |                            | Logs Castle API requests/responses; must respond to `info`.                                                     |
| `doNotTrack`        | `boolean`          | `false`                    | When `true`, suppresses all requests and triggers failover on `risk`. Useful in development and testing.        |
| `allowlisted`       | `string[]`         | `[]`                       | Strict header allow-list (see [Header allow/deny lists](#header-allowdeny-lists)).                              |
| `denylisted`        | `string[]`         | `[]`                       | Headers to always scrub, in addition to the always-blocked `Cookie` / `Authorization`.                          |
| `ipHeaders`         | `string[]`         | `[]`                       | Custom headers to read the client IP from (see [Client IP detection](#client-ip-detection)).                    |
| `trustedProxies`    | `string[]`         | `[]`                       | Known proxy IPs (strings or regexes). Pick this **or** `trustedProxyDepth`, never both.                         |
| `trustedProxyDepth` | `number`           | `0`                        | Number of known trusted proxies in the chain. Pick this **or** `trustedProxies`, never both.                    |
| `trustProxyChain`   | `boolean`          | `false`                    | Trust the entire `X-Forwarded-For` chain. **Warning:** promiscuous — a malicious proxy can spoof the client IP. |
| `baseUrl`           | `string`           | `https://api.castle.io/v1` | Base Castle API URL.                                                                                            |

### Multi-environment / multi-tenant

Each `Castle` instance carries its own configuration, so multiple environments or tenants are just multiple instances:

```js
const castleTenantA = new Castle({
  apiSecret: process.env.CASTLE_API_SECRET_TENANT_A,
});
const castleTenantB = new Castle({
  apiSecret: process.env.CASTLE_API_SECRET_TENANT_B,
});
```

## Usage

All endpoints are async methods on a `Castle` instance.

### Risk

Evaluates high-risk events (logins, registrations, password resets, transactions). Returns a verdict (`policy.action`) plus risk scores and signals.

```js
await castle.risk({
  type: '$login',
  status: '$succeeded',
  request_token: req.body.castle_request_token,
  user: { id: '12345', email: 'user@example.com' },
  context,
});
```

### Filter

Blocks bots and bad traffic early in the chain (typically registration). Same response shape as Risk.

```js
await castle.filter({
  type: '$registration',
  status: '$attempted',
  request_token: req.body.castle_request_token,
  params: { email: 'user@example.com' },
  context,
});
```

### Log

Fire-and-forget event logging; no verdict is returned. Useful for events that should be visible in the dashboard but don't need a real-time decision.

```js
await castle.log({
  type: '$profile_update',
  status: '$succeeded',
  user: { id: '12345' },
  context,
});
```

### Lists & List Items

Lists let you organize users, IPs, transactions, or any custom property and use them in policies as allow/deny lists:

```js
const list = await castle.createList({
  name: 'Trusted IPs',
  color: 'green',
  primary_field: 'ip.address',
});

await castle.createListItem({
  list_id: list.id,
  primary_value: '1.2.3.4',
});

await castle.searchListItems({
  list_id: list.id,
  filters: { primary_value: '1.2.3.4' },
});
```

Available methods: `createList`, `fetchAllLists`, `fetchList`, `updateList`, `deleteList`, `searchLists`, `createListItem`, `batchUpdateListItems`, `fetchListItem`, `searchListItems`, `countListItems`, `updateListItem`, `archiveListItem`, `unarchiveListItem`.

### Privacy (GDPR)

Supports GDPR Articles 15 (right of access) and 17 (right to be forgotten) via `/v1/privacy/users`. Both take an `identifier` and `identifier_type` (`$id` or `$email`):

```js
await castle.requestUserData({
  identifier: 'rhea@example.org',
  identifier_type: '$email',
});

await castle.deleteUserData({
  identifier: 'user_42',
  identifier_type: '$id',
});
```

### Events (enterprise)

Query, group, and inspect the schema of stored events. Use `queryEvents`,
`groupEvents`, and `eventsSchema`:

```js
await castle.queryEvents({
  filters: [
    /* ... */
  ],
});
await castle.groupEvents({
  filters: [],
  group_by: { fields: [] },
  columns: [],
});
await castle.eventsSchema();
```

`searchEvents` and `getEventsSchema` are also available as aliases of
`queryEvents` and `eventsSchema`.

### Webhook signature verification

Castle signs every webhook with an `X-Castle-Signature` header. Verify it against the **raw** request body before trusting the payload — `verifyWebhookSignature` throws a `WebhookVerificationError` on mismatch:

```js
import express from 'express';
import { WebhookVerificationError } from '@castleio/sdk';

const app = express();

// The signature is computed over the raw body, so capture it as a Buffer.
app.post(
  '/castle/webhooks',
  express.raw({ type: 'application/json' }),
  (req, res) => {
    try {
      castle.verifyWebhookSignature(req.body, req.get('x-castle-signature'));
    } catch (err) {
      if (err instanceof WebhookVerificationError) {
        return res.sendStatus(400);
      }
      throw err;
    }

    const event = JSON.parse(req.body.toString());
    // signature is valid; proceed
    res.sendStatus(200);
  }
);
```

### Secure mode

Secure mode signs the user id server-side so it can't be tampered with in the browser. Pass the signature to the client-side `castle.js` SDK:

```js
const signature = castle.secureModeSignature('user_123');
```

The signature is a hex HMAC-SHA256 of the user id keyed with your API secret.

## Advanced configuration

The defaults are good for most deployments. The options below only matter if you have a non-trivial proxy chain or strict header policies.

### Header allow/deny lists

By default the SDK sends every HTTP header except `Cookie` and `Authorization`. Castle uses these headers to fingerprint the request, so the broader the better.

```js
import { DEFAULT_ALLOWLIST } from '@castleio/sdk';

const castle = new Castle({
  apiSecret: process.env.CASTLE_API_SECRET,

  // Always-blocked headers (in addition to Cookie/Authorization).
  denylisted: ['X-Internal-Header'],

  // Strict allow-list mode. Headers outside the list are sent with scrubbed
  // values, except User-Agent which is always preserved. If you must use an
  // allow list, we recommend starting from the curated default.
  allowlisted: DEFAULT_ALLOWLIST,
});
```

Header names are case-insensitive and accept both `_` and `-` as separators. A leading `HTTP_` prefix is stripped automatically.

### Client IP detection

Castle needs the original client IP, not the IP of your proxy or load balancer. The SDK reads `X-Forwarded-For` and `Remote-Addr` by default; pick **one** of the strategies below depending on your infrastructure:

```js
const castle = new Castle({
  apiSecret: process.env.CASTLE_API_SECRET,

  // 1. Custom header (e.g. Cloudflare's Cf-Connecting-Ip).
  ipHeaders: ['Cf-Connecting-Ip'],

  // 2. Static, known proxy IPs.
  trustedProxies: ['10.0.0.1'],

  // 3. Ephemeral proxies but known chain depth.
  trustedProxyDepth: 2,

  // 4. Last resort: trust the entire X-Forwarded-For chain.
  // Warning: vulnerable to header spoofing if a malicious proxy is in path.
  trustProxyChain: false,
});
```

Pick **either** `trustedProxies` **or** `trustedProxyDepth`, never both. Private/loopback ranges in the exported `TRUSTED_PROXIES` constant are always considered trusted.

## Errors

All API exceptions inherit from `APIError`; `ConfigurationError` is raised for setup problems. The most useful ones:

| Class                      | Raised when                                             |
| -------------------------- | ------------------------------------------------------- |
| `ConfigurationError`       | The SDK is misconfigured (missing API secret, bad URL). |
| `BadRequestError`          | `400` response.                                         |
| `UnauthorizedError`        | `401` — bad API secret.                                 |
| `ForbiddenError`           | `403` response.                                         |
| `NotFoundError`            | `404` response.                                         |
| `InvalidParametersError`   | `422` response with validation details.                 |
| `InvalidRequestTokenError` | `422` — the `request_token` is missing or invalid.      |
| `RateLimitError`           | `429` — back off and retry.                             |
| `InternalServerError`      | `5xx` response from Castle.                             |
| `WebhookVerificationError` | A webhook signature did not match.                      |

The full list lives in [`src/errors.ts`](src/errors.ts).

## Upgrading to 3.0.0

`3.0.0` is a modernization release. The public API (the `Castle` class and its
methods) is unchanged — most projects can upgrade without code changes.

What changed:

- **Legacy endpoints removed.** `authenticate`, `track`, and the device
  endpoints (`getDevice`, `getDevicesForUser`, `approveDevice`, `reportDevice`)
  are gone — use `risk`, `filter`, and `log` instead. The matching payload types
  (`Payload`, `DevicePayload`, `UserDevicePayload`, `AuthenticateResult`) were
  removed too.
  - If you previously used `reportDevice` / `approveDevice`, manage device
    approvals and reports with the **Lists API** instead (e.g.
    `createListItem` / `archiveListItem`). See
    [Reporting devices using Lists](https://docs.castle.io/docs/reporting-devices-using-lists).
- **Node.js `>= 20` is now required.** The SDK uses the runtime's built-in
  `fetch` and `AbortSignal` instead of `node-fetch` / `abort-controller`, which
  are no longer dependencies.
- **Dual ESM + CommonJS build.** The package now exposes a proper `exports` map
  with separate `import` and `require` entry points and type definitions. Deep
  imports into `dist/` were never supported and remain unsupported; import from
  the package root (`@castleio/sdk`).
- The `lodash.*` micro-dependencies were removed in favor of native JavaScript;
  this is internal and does not affect behavior.

If you previously relied on a custom `overrideFetch`, it still works — pass any
`fetch`-compatible implementation.

## License

Available as open source under the terms of the [MIT License](LICENSE).
