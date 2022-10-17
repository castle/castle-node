# Castle SDK for Node

**[Castle](https://castle.io) analyzes user behavior in web and mobile apps to stop fraud before it happens.**

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

When using setup without the modules:

```js
const { Castle } = require('@castleio/sdk');

const castle = new Castle({ apiSecret: 'YOUR SECRET HERE' });
```


#### Config options

| Config option     | Type | Default | Explanation |
| ----------------- | ---- |-------- | ----------- |
| apiSecret         | `string` |  | API key which can be found in the Castle dashboard https://dashboard.castle.io/settings/general |
| timeout           | `number` | 1500 | Time before returning the failover strategy. |
| allowlisted       | `string[]` | [] | by default, the SDK sends all HTTP headers, except for Cookie and Authorization. <br/><br/> If you decide to use a allowlist, the SDK will:<br/>- always send the User-Agent header<br/>- send scrubbed values of non-allowlisted headers<br/>- send proper values of allowlisted headers.<br/><br/>We highly suggest using denylist instead of allowlist, so that Castle can use as many data points as possible to secure your users. If you want to use the allowlist, this is the minimal amount of headers we recommend: DEFAULT_ALLOWLIST  |
| denylisted        | `string[]` | [] | Denylisted headers take precedence over allowlisted elements. We always denylist Cookie and Authentication headers. If you use any other headers that might contain sensitive information, you should denylist them |
| failoverStrategy  | `FailoverStrategy` | `FailoverStrategy.allow` | If the request to our service would for some reason time out, this is where you select the automatic response from `authenticate`. Options are `FailoverStrategy.allow`, `FailoverStrategy.deny`, `FailoverStrategy.challenge`. |
| logger            | `any` | | Logs Castle API requests and responses, has to respond to `info` method. |
| doNotTrack        | `boolean` | False | setting it to true turns off all requests and triggers automatic failover on `authenticate`. Used for development and testing. |
| ipHeaders         | `string[]` | [] | Castle needs the original IP of the client, not the IP of your proxy or load balancer. The SDK will only trust the proxy chain as defined in the configuration.We try to fetch the client IP based on X-Forwarded-For or Remote-Addr headers in that order, but sometimes the client IP may be stored in a different header or order. The SDK can be configured to look for the client IP address in headers that you specify.<br/>Sometimes, Cloud providers do not use consistent IP addresses to proxy requests. In this case, the client IP is usually preserved in a custom header. <br/>Example: Cloudflare preserves the client request in the 'Cf-Connecting-Ip' header. |
| trustedProxies    | `string[]` | [] | If the specified header or X-Forwarded-For default contains a proxy chain with public IP addresses, then you must choose only one of the following (but not both): <br/>1. The trusted_proxies value must match the known proxy IPs. This option is preferable if the IP is static. <br/>2. The trusted_proxy_depth value must be set to the number of known trusted proxies in the chain (see below).This option is preferable if the IPs are ephemeral, but the depth is consistent. <br/>Additionally to make X-Forwarded-For and other headers work better discovering client ip address,and not the address of a reverse proxy server, you can define trusted proxies which will help to fetch proper ip from those headers. <br/>In order to extract the client IP of the X-Forwarded-For header and not the address of a reverse proxy server, you must define all trusted public proxies you can achieve this by listing all the proxies ip defined by string or regular expressions in the trusted_proxies setting <br/> |
| trustedProxyDepth   | `number`  | 0 | ...or by providing number of trusted proxies used in the chain,   (note that you must pick one approach over the other. either trustProxyChain orr trustedProxies) |
| trustProxyChain | `boolean` | False | If there is no possibility to define options above and there is no other header that holds the client IP, then you may set this option to True to trust all of the proxy IPs in X-Forwarded-For , *Warning*: this mode is highly promiscuous and could lead to wrongly trusting a spoofed IP if the request passes through a malicious proxy |
| baseUrl           | `string` | `https://api.castle.io/v1` | base Castle API url  |
