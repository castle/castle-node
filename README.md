# Node.js SDK for Castle

**[Castle](https://castle.io) adds real-time monitoring of your authentication stack, instantly notifying you and your users on potential account hijacks.**

## Installation

Obtain the latest version of the SDK with npm:

```bash
npm install castleio-sdk
```

## Getting Started: The Vanilla Way

```javascript
import Castle from 'castleio-sdk';
var castle = new Castle({apiSecret : 'YOUR-SECRET-HERE'});
castle.trackEvent({
    event     : Castle.Events.LOGIN_SUCCEEDED, //This can also be a string EX: $login.failed
    user_id   : 2473, //The ID of your user
    details   : { //Optional
        email: castle@castle.io
    },
    userAgent : 'Really long user agent string here',
    cookie    : 'The cookie the client side javascript created with the name __cid',
    ip        : '0.0.0.0',
    headers   : {} //Tons of headers here
}).then(obj => {
    //Handle success
    //Note that "obj" is almost always just {}
}).catch(e => {
    //Handle error
});
```

## Getting Started: The Express Way

First, intialize the SDK with the rest of your Express 4.x middleware
```javascript
import Castle from 'castleio-sdk'
app.use(Castle.express({apiSecret : 'YOUR-SECRET-HERE'}));
```

To track events

```javascript
(request, response, next) => {
    request.trackEvent({
        event     : request.castleEvents.LOGIN_SUCCEEDED,
        user_id   : 2473, //The ID of your user
        details   : { //Optional
            email: castle@castle.io
        }
    }).then(obj => {
        //Handle success
        //Note that "obj" is almost always just {}
    }).catch(e => {
        //Handle error
        next(e)
    });   
}
```

## Options

The Castle object accepts these options upon initialization

| Code                             | Description     |Default    |
|:---------------------------------|:----------------|:----------|
|apiKey|Your api key. This is currently unused|null|
|apiSecret|Your api secret. This is used for authenticating you|undefined|
|disableClientUserAgent|Wether or not you want to send SDK info and OS information to castle for analytics|false|

## Errors
Whenever something unexpected happens, a error is created and returned. Here's a list of errors
that we're shamefully created

| Code                             | Description     |
|:---------------------------------|:----------------|
|MISSING_EVENT_NAME|You've missed the event parameter for the trackEvent function|
|INVALID_HTTP_STATUS_CODE|The HTTP Code returned by the Castle API was unexpected|