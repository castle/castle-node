# Changelog

## 3.0.1

**Housekeeping:**

- Slim down the default request context to `headers`, `ip`, and `library`. The
  client id is carried by `headers` (the `x-castle-client-id` header / `__cid`
  cookie) and resolved by Castle server-side, so the SDK no longer derives it
  separately.
- Remove the internal client-id extraction service and the now-unused cookie
  helper (`HeadersGetCookieService`) along with the `cookies` plumbing in
  `ContextGetDefaultService` / `ContextPrepareService`.

## 3.0.0

**BREAKING CHANGES:**

- Remove the legacy endpoints and their `Castle` methods: `authenticate`,
  `track`, and the device endpoints (`getDevice`, `getDevicesForUser`,
  `approveDevice`, `reportDevice`). Use `risk` / `filter` / `log` instead. The
  related public types (`Payload`, `DevicePayload`, `UserDevicePayload`,
  `AuthenticateResult`) are removed as well.
- Require Node.js `>= 20`. The SDK now uses the runtime's built-in global
  `fetch` and `AbortSignal` instead of `node-fetch` and `abort-controller`,
  which are no longer dependencies.
- Ship a proper dual ESM + CommonJS build via `tsup` with an `exports` map
  (separate `import`/`require` entry points and type definitions). Importing
  from internal `dist/` paths is unsupported; import from the package root.

**Features:**

- Add webhook signature verification: `Castle#verifyWebhookSignature(rawBody, signature)`
  (and `WebhookVerifyService`) validate the `X-Castle-Signature` header — a
  base64 HMAC-SHA256 of the raw request body, compared in constant time — and
  raise `WebhookVerificationError` on mismatch.
- Add secure-mode signing: `Castle#secureModeSignature(userId)` (and
  `SecureModeService`) return a hex HMAC-SHA256 of the user id, for signing user
  IDs sent from the browser.

**Enhancements:**

- Rename the Events API methods to `queryEvents`, `eventsSchema`, and
  `groupEvents`. `searchEvents` and `getEventsSchema` remain available as
  aliases of `queryEvents` and `eventsSchema`, so existing code keeps working.
- Drop the `lodash.get` / `lodash.isempty` / `lodash.merge` / `lodash.pickby` /
  `lodash.reduce` micro-dependencies in favor of native JavaScript helpers
  (`src/utils/object.ts`).
- Modernize `tsconfig.json`: target `ES2022`, move the `strict` flag under
  `compilerOptions` (it was previously a top-level key and silently ignored, so
  strict type-checking was effectively off), and drop unused decorator options.
  `strictNullChecks` is now enforced.
- Bump `pino` to v9 and `pino-pretty` to v13.
- Migrate CI from CircleCI to GitHub Actions with a Node 20/22/24/26 matrix.
- Switch the package manager from Yarn (classic) to npm (`package-lock.json`,
  `npm ci` in CI).
- Add `.tool-versions` / `.nvmrc` pinning Node `26.2.0`.
- Add `engines.node >= 20` and a `typecheck` script.
- Remove the dead `ImpersonationFailed` error (impersonation endpoints no longer
  exist in the SDK).
- Restructure the README to match the other Castle SDKs: capabilities list,
  quick start, a full Usage section (Risk/Filter/Log/Lists/Privacy/Events/
  Webhooks/Secure mode), advanced header/IP configuration, and an errors table.

**Bug fixes:**

- Add a fully-typed `transaction` field to `RiskPayload`, modelled on the public
  [OpenAPI schema](https://reference.castle.io/#operation/risk): `base_amount` is
  a string, `amount` is a `$fiat`/`$crypto` object, plus `payment_method`,
  `shipping_address` and `merchant`. Exported as `TransactionPayload` — addresses
  [#188](https://github.com/castle/castle-node/issues/188).
- Extend `FilterPayload` and `LogPayload` with the same `transaction` field, since
  both endpoints accept it.
- Add the missing `region_code` to `AddressPayload` and type
  `RiskPayload.user.address` as `AddressPayload`.
- `risk` no longer throws a `TypeError` in `doNotTrack` mode when the payload
  has no `user` object.

## 2.3.3

- [#184](https://github.com/castle/castle-node/pull/184)
  - revert incomplete ESM migration

## 2.3.1

- [#168](https://github.com/castle/castle-node/pull/168)
  - make request_token and context optional based on skip parameters
- [#176](https://github.com/castle/castle-node/pull/176)
  - support for POST events/query
- [#180](https://github.com/castle/castle-node/pull/180)
  - Introduce APIs:
    - events/schema, events/group
    - POST privacy/users, DELETE privacy/users
    - lists/:id/items/batch, lists/:id/items/count

## 2.2.2

- [#164](https://github.com/castle/castle-node/pull/164)
  - handle rate limiting and general API errors
- [#159](https://github.com/castle/castle-node/pull/159)
  - fix failed event status name
- [#160](https://github.com/castle/castle-node/pull/160) [#161](https://github.com/castle/castle-node/pull/161) [#162](https://github.com/castle/castle-node/pull/162) [#163](https://github.com/castle/castle-node/pull/163) [#165](https://github.com/castle/castle-node/pull/165)
  - Bump dependencies

## 2.2.1

- [#157](https://github.com/castle/castle-node/pull/157)
  - exposed more data types publicly

## 2.2.0

- [#155](https://github.com/castle/castle-node/pull/155)
- [#152](https://github.com/castle/castle-node/pull/152)
- [#151](https://github.com/castle/castle-node/pull/151)
- [#150](https://github.com/castle/castle-node/pull/150)
  - added more typings, consts and added List API

- [#154](https://github.com/castle/castle-node/pull/154)
- [#153](https://github.com/castle/castle-node/pull/153)
  - dependencies bumps, removed express.js dependency

## 2.1.1

- [#146](https://github.com/castle/castle-node/pull/146)
  - add and expose more typings

- [#147](https://github.com/castle/castle-node/pull/147)
  - internal dependencies bumps

## 2.1.0

- [#142](https://github.com/castle/castle-node/pull/142)
  - dependencies updates

- [#143](https://github.com/castle/castle-node/pull/143)
- [#144](https://github.com/castle/castle-node/pull/144)
  - updated definitions to match API schema

## 2.0.1

- [#140](https://github.com/castle/castle-node/pull/140)
- [#138](https://github.com/castle/castle-node/pull/138)
  - dependencies and readme updates

## 2.0.0

**BREAKING CHANGES:**

- [#135](https://github.com/castle/castle-node/pull/135)
  - removed auto context building from the command payload generation. Follow https://docs.castle.io/ for passing the context to the commands. This version does not build context when castle commands are called. `ContextPrepareService` should be used explicitly.

**Enhancements**

- allowed to import errors classes and constants

- [#136](https://github.com/castle/castle-node/pull/136)
  - fixes inconsistencies regarding failover responses between the commands
  - removed unused code

## 1.2.0

**BugFix:**

- [#132](https://github.com/castle/castle-node/pull/132)
  - fixed how options in the context prepare are merged
  - changed/fixed how payload prepare options are merge

**Enhancements**

- [#133](https://github.com/castle/castle-node/pull/133)
  - increased default timeout from 1000 to 1500
- [#133](https://github.com/castle/castle-node/pull/133)
  - exposed ContextPrepareService

## 1.1.1

**Enhancements**

- [#131](https://github.com/castle/castle-node/pull/131)
  - failover response enhancement, removed X-Castle header from allowlist

## 1.1.0

**Enhancements**

- [#127](https://github.com/castle/castle-node/pull/127)
  - Introduce a new exception `InvalidRequestTokenError` for facilitating handling of all request token related errors

## 1.0.3

**BugFix:**

- [#120](https://github.com/castle/castle-node/pull/120)
  - removes body in request for GET requests

## 1.0.2

**BugFix:**

- [#119](https://github.com/castle/castle-node/pull/119)
  - fixed path resolving

## 1.0.1

**Enhancements:**

- [#117](https://github.com/castle/castle-node/pull/117)
  - typings improvements

## 1.0.0

**BREAKING CHANGES:**

- remove `identify` and `review` commands - they are no longer supported

- renamed setUseWhitelist with setUseAllowlist

- added better support for configuration, replaced apiUrl with baseUrl option
  - [#97](https://github.com/castle/castle-node/pull/97)

- replace logLevel with logger in the config
  - [#97](https://github.com/castle/castle-node/pull/111)

- dropped EVENTS const with list of events \* [#97](https://github.com/castle/castle-node/pull/114)
  **Enhancements:**
- restructuring the codebase
  - [#89](https://github.com/castle/castle-node/pull/89)
  - [#90](https://github.com/castle/castle-node/pull/90)
  - [#91](https://github.com/castle/castle-node/pull/91)
  - [#100](https://github.com/castle/castle-node/pull/100)
  - [#101](https://github.com/castle/castle-node/pull/101)
  - [#102](https://github.com/castle/castle-node/pull/102)
  - [#110](https://github.com/castle/castle-node/pull/110)
  - [#110](https://github.com/castle/castle-node/pull/113)

- added failover and timeout support
  - [#93](https://github.com/castle/castle-node/pull/93)

- added ability to set ip headers and proxies
  - [#96](https://github.com/castle/castle-node/pull/96)

- added request context builder
  - [#100](https://github.com/castle/castle-node/pull/100)

- added request context builder
  - [#100](https://github.com/castle/castle-node/pull/100)

- added device endpoints
  - [#106](https://github.com/castle/castle-node/pull/106)
  - [#107](https://github.com/castle/castle-node/pull/107)
  - [#108](https://github.com/castle/castle-node/pull/108)
  - [#109](https://github.com/castle/castle-node/pull/109)

- added risk, filter, log endpoints
  - [#112](https://github.com/castle/castle-node/pull/112)

## 0.5.0

**Enhancements:**

- [#87](https://github.com/castle/castle-node/pull/87) added risk policy information to the authenticate response

## 0.4.7

**BREAKING CHANGES:**

- [#42](https://github.com/castle/castle-node//pull/42)
  - remove `identify` and `review` commands - they are no longer supported
  - renamed setUseWhitelist with setUseAllowlist

**Enhancements:**

- Re-publish to fix broken build
