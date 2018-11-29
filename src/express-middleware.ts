// var Events = require('castleio-sdk').Events;

// optformat
// {
//   routes: {
//     '/login': {
//       statusCode: 200,
//       method: 'POST',
//       event: Castle.Events.LOGIN_SUCCEEDED,
//     },
//   },
// }
//

const requestMatchesOpts = (request, response, opts) => {
  if (
    !opts ||
    opts.statusCode !== response.statusCode ||
    opts.method !== request.method
  ) {
    return false;
  }

  return true;
};

export const castleExpressMw = (castle, { userIdGetter, routes }) => {
  return (request, response, next) => {
    const beforeHandlerUserId = userIdGetter(request);

    response.on('finish', async () => {
      const requestOpts = routes[request.originalUrl];

      if (requestMatchesOpts(request, response, requestOpts)) {
        const userId = userIdGetter(request);
        const requestData = {
          cookie: request.cookies.__cid,
          headers: request.headers,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
        };

        console.log('TRACKEVENT', {
          event: requestOpts.event,
          user_id: userId || beforeHandlerUserId,
          ...requestData,
        });
        try {
          await castle.trackEvent({
            event: requestOpts.event,
            user_id: userId || beforeHandlerUserId,
            ...requestData,
          });
        } catch (e) {
          console.error(e);
        }
      }
    });

    next();
  };
};
