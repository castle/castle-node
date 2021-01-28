# Node SDK for Castle

**[Castle](https://castle.io) analyzes device, location, and interaction patterns in your web and mobile apps and lets you stop account takeover attacks in real-time..**

## Documentation

[Official Castle docs](https://castle.io/docs)

## Installation

Add the `@castleio/sdk` package to your `package.json`.

### yarn

```bash
yarn add @castleio/sdk
```

### npm

```bash
npm install --save @castleio/sdk
```

## Configuration

### Framework configuration

Load and configure the library with your Castle API secret in an initializer or similar.

```js
import { Castle } from '@castleio/sdk';

const castle = Castle({ apiSecret: 'YOUR SECRET HERE' });
```

#### Config options

| Config option     | Explanation |
| ----------------- | ----------- |
| apiSecret         | `string` - This can be found in the castle dashboard. |
| timeout           | `number` - Time before returning the failover strategy. Default value is 500. |
| allowlisted       | `string[]` - An array of strings matching the headers you want to pass fully to the service. |
| denylisted        | `string[]` - An array of of strings matching the headers you do not want to pass fully to the service. |
| failoverStrategy  | `string` - If the request to our service would for some reason time out, this is where you select the automatic response from `authenticate`. Options are `allow`, `deny`, `challenge`. |
| logLevel          | `string` - Corresponds to standard log levels: `trace`, `debug`, `info`, `warn`, `error`, `fatal`. Useful levels are `info` and `error`. |
| doNotTrack        | `boolean` - False by default, setting it to true turns off all requests and triggers automatic failover on `authenticate`. Used for development and testing. |
| ipHeaders         | `string[]` - IP Headers to look for a client IP address. |
| trustedProxies    | `string[]` - Trusted public proxies list. |
| trustProxyChain   | `boolean` - False by default, defines if trusting all of the proxy IPs in X-Forwarded-For is enabled. |
| trustedProxyDepth | `number` - Number of trusted proxies used in the chain. |

## Actions

The `castle` instance exposes two methods, `track` and `authenticate`. In order to provide the information required in both these methods, you'll need access to the logged in user information (if that is available at that stage in the user flow), as well as request information. In node connect/express, the user is often found in the `session` object, or directly on the `request` object in the `user` property, if you are using passport.

### track

This is the asynchronous version of the castle integration. This is for events where you don't require a response.

```js
import { EVENTS } from '@castleio/sdk';

track({
  event: EVENTS.EMAIL_CHANGE_SUCCEEDED,
  user_id: user.id,
  user_traits: {
    email: user.email,
    registered_at: user.registered_at,
  },
  context: {
    ip: request.ip,
    client_id: request.cookies['__cid'],
    headers: request.cookies,
  },
});
```

### authenticate

This is the synchronous version of the castle integration. This is for events where you require a response. It is used in the same way as `track`, except that you have the option of waiting for a response.

```js
let response;
try {
  const response = await castle.authenticate({
    event: EVENTS.EMAIL_CHANGE_SUCCEEDED,
    user_id: user.id,
    user_traits: {
      email: user.email,
      registered_at: user.registered_at,
    },
    context: {
      ip: request.ip,
      client_id: request.cookies['__cid'],
      headers: request.headers,
    },
  });
} catch (e) {
  console.error(e);
}

console.log(response); // { "action": "allow", "user_id": 123, "device_token": "eyj...." }
```

####

Response format

| Response key    | value                                                                                               |
| --------------- | --------------------------------------------------------------------------------------------------- |
| action          | `string` - The recommended action for the given event. Options: `allow`, `challenge`, `deny`.       |
| user_id         | `string` - The `user_id` of the end user.                                                           |
| risk_policy     | `object` - object containing risk policy information, such as `id`,`revision_id`, `name` and `type` |
| device_token    | `string` - Our token for the device that generated the event.                                       |
| failover        | `boolean` - An optional property indicating the request failed and the response is a failover.      |
| failover_reason | `string` - A message indicating why the request failed.                                             |

### All config options for `track` and `authenticate`

| Config option | Explanation                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| event         | `string` - The event generated by the user. It can be either an event from `EVENTS` or a custom one.                                                      |
| user_id       | `string` - The `user_id` of the end user.                                                                                                                 |
| user_traits   | `object` - An optional, recommended, object containing user information, such as `email` and `registered_at`.                                             |
| properties    | `object` - An optional object containing custom information.                                                                                              |
| created_at    | `string` - An optional ISO date string indicating when the event occurred, in cases where this might be different from the time when the request is made. |
| device_token  | `string` - The optional device token, used for mitigating or escalating.                                                                                  |
| context       | `object` - The request context information. See information below.                                                                                        |

| Context option | Explanation                                                                                                                                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ip             | `string` - The IP address of the request. Note that this needs to be the original request IP, not the IP of an internal proxy, such as nginx.                                                                    |
| client_id      | `string` - The client ID, generated by the `c.js` integration on the front end. Commonly found in the `__cid` cookie in `request.cookies` or `request.cookie`, or in some cases the `X-CASTLE-CLIENT-ID` header. |
| headers        | `object` - The headers object on the request, commonly `request.headers`.                                                                                                                                        |
