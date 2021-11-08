# Castle SDK for Node

**[Castle](https://castle.io) analyzes device, location, and interaction patterns in your web and mobile apps and lets you stop account takeover attacks in real-time..**

## Usage

See the [documentation](https://docs.castle.io) for how to use this SDK with the Castle APIs

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

const castle = new Castle({ apiSecret: 'YOUR SECRET HERE' });
```

#### Config options

| Config option     | Explanation |
| ----------------- | ----------- |
| apiSecret         | `string` - This can be found in the Castle dashboard. |
| baseUrl           | `string` - Base Castle API url. |
| timeout           | `number` - Time before returning the failover strategy. Default value is 500. |
| allowlisted       | `string[]` - An array of strings matching the headers you want to pass fully to the service. We highly recommend using the DEFAULT_ALLOWLIST constant. |
| denylisted        | `string[]` - An array of of strings matching the headers you do not want to pass fully to the service. |
| failoverStrategy  | `FailoverStrategy` - If the request to our service would for some reason time out, this is where you select the automatic response from `authenticate`. Options are `FailoverStrategy.allow`, `FailoverStrategy.deny`, `FailoverStrategy.challenge`. |
| logger            | `any` - Logs Castle API requests and responses, has to respond to `info` method. |
| doNotTrack        | `boolean` - False by default, setting it to true turns off all requests and triggers automatic failover on `authenticate`. Used for development and testing. |
| ipHeaders         | `string[]` - IP Headers to look for a client IP address. |
| trustedProxies    | `string[]` - Trusted public proxies list. |
| trustProxyChain   | `boolean` - False by default, defines if trusting all of the proxy IPs in X-Forwarded-For is enabled. |
| trustedProxyDepth | `number` - Number of trusted proxies used in the chain. |

