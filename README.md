# Node.js SDK for Castle

**[Castle](https://castle.io) adds real-time monitoring of your authentication stack, instantly notifying you and your users on potential account hijacks.**

## Installation

Obtain the latest version of the SDK with npm:

```bash
npm install castleio-sdk
```

## Getting Started: The Manly Way

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

```javascript`
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