# Node.js SDK for Castle

**[Castle](https:castle.io) adds real-time monitoring of your authentication stack, instantly notifying you and your users on potential account hijacks.**

## Installation

Obtain the latest version of the SDK with npm:

```bash
npm install castleio-sdk
```

## Getting Started: The Vanilla Way

### Initializing

```javascript
import Castle from 'castleio-sdk';
var castle = new Castle({apiSecret : 'YOUR-SECRET-HERE'});
```

### Tracking Events

```javascript

castle.trackEvent({
    event     : Castle.Events.LOGIN_SUCCEEDED, This can also be a string EX: $login.failed
    user_id   : 2473, The ID of your user
    details   : { Optional
        email: castle@castle.io
    },
    userAgent : 'Really long user agent string here',
    cookie    : 'The cookie the client side javascript created with the name __cid',
    ip        : '0.0.0.0',
    headers   : {} Tons of headers here
}).then(obj => {
    Handle success
    Note that "obj" is almost always just {}
}).catch(e => {
    Handle error
});
```

### Identifying Users

```javascript
castle.identify({
    user_id   : 2473, The ID of your user
    user_data   : { Optional
        email: castle@castle.io
    },
    userAgent : 'Really long user agent string here',
    cookie    : 'The cookie the client side javascript created with the name __cid',
    ip        : '0.0.0.0',
    headers   : {} Tons of headers here
}).then(obj => {
    Handle success
    Note that "obj" is almost always just {}
}).catch(e => {
    Handle error
});
```

## Getting Started: The Express Way

This is the way to go if you're using Express 4.x

### Initializing

```javascript
import Castle from 'castleio-sdk'
app.use(Castle.express({apiSecret : 'YOUR-SECRET-HERE'}));
```

### Tracking Events

```javascript
(request, response, next) => {
    request.trackEvent({
        event     : request.castleEvents.LOGIN_SUCCEEDED,
        user_id   : 2473, The ID of your user
        details   : { Optional
            email: castle@castle.io
        }
    }).then(obj => {
        Handle success
        Note that "obj" is almost always just {}
    }).catch(e => {
        Handle error
        next(e)
    });   
}
```

### Identifying Users

```javascript
(request, response, next) => {
    request.identify({
        user_id   : 2473, The ID of your user
        user_data   : { Optional
            email: castle@castle.io
        }
    }).then(obj => {
        Handle success
        Note that "obj" is almost always just {}
    }).catch(e => {
        Handle error
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

## Events

These are the events Available through Castle.Events

| Code                             | Description     |Default    |
|:---------------------------------|:----------------|:----------|
|   LOGIN_SUCCEEDED           | $login.succeeded | Record when a user attempts to log in|
|   LOGIN_FAILED              | $login.failed | Record when a user logs out|
|   LOGOUT_SUCCEEDED          | $logout.succeeded | Record when a user logs out|
|   REGISTRATION_SUCCEEDED    | $registration.succeeded | Capture account creation, both when a user signs up as well as when created manually by an administrator|
|   REGISTRATION_FAILED       | $registration.failed | Record when an account failed to be created|
|   EMAIL_CHANGE_REQUESTED    | $email_change.requested | An attempt was made to change a user’s email|
|   EMAIL_CHANGE_SUCCEEDED    | $email_change.succeeded | The user completed all of the steps in the email address change process and the email was successfully changed|
|   EMAIL_CHANGE_FAILED       | $email_change.failed | Use to record when a user failed to change their email address|
|   PASSWORD_RESET_REQUESTED  | $password_reset.requested | An attempt was made to reset a user’s password|
|   PASSWORD_RESET_SUCCEEDED  | $password_reset.succeeded | The user completed all of the steps in the password reset process and the password was successfully reset. Password resets do not required knowledge of the current password|
|   PASSWORD_RESET_FAILED     | $password_reset.failed | Use to record when a user failed to reset their password|
|   PASSWORD_CHANGE_SUCCEEDED | $password_change.succeeded |Use to record when a user changed their password. This event is only logged when users change their own password|
|   PASSWORD_CHANGE_FAILED    | $password_change.failed | Use to record when a user failed to change their password|
|   CHALLENGE_REQUESTED       | $challenge.requested | Record when a user is prompted with additional verification, such as two-factor authentication or a captcha|
|   CHALLENGE_SUCCEEDED       | $challenge.succeeded | Record when additional verification was successful|
|   CHALLENGE_FAILED          | $challenge.failed |Record when additional verification failed|

## Errors
Whenever something unexpected happens, a error is created and returned. Here's a list of errors
that we're shamefully created

| Code                             | Description     |
|:---------------------------------|:----------------|
|MISSING_EVENT_NAME|You've missed the event parameter for the trackEvent function|
|INVALID_HTTP_STATUS_CODE|The HTTP Code returned by the Castle API was unexpected|