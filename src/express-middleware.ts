import { Request, Response, NextFunction, Send } from 'express';
import { Castle } from './Castle';
import { EVENTS } from './events';

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

type Route = {
  statusCode: number;
  method: string;
  event: string;
};

type CastleMwOptions = {
  routes: { [key: string]: Route };
  userGetter: (request: Request) => { email: string; id: string };
};

type Header = {};

type RequestData = {
  cookie: string;
  headers: any;
  ip: string;
  userAgent: string;
};

type UpgradedRequest = Request & {
  session?: any;
};

const requestMatchesOpts = (
  request: Request,
  response: Response,
  opts: Route
) => {
  if (
    !opts ||
    opts.statusCode !== response.statusCode ||
    opts.method !== request.method
  ) {
    return false;
  }

  return true;
};

export const castleExpressMw = (
  castle: Castle,
  { userGetter, routes }: CastleMwOptions
) => {
  return (request: UpgradedRequest, response: Response, next: NextFunction) => {
    const shortCircuit = false;
    const beforeHandlerUser = userGetter(request);

    const originalSend = response.send;
    // tslint:disable-next-line:only-arrow-functions
    response.send = function(data) {
      const requestOpts = routes[request.originalUrl];

      if (requestMatchesOpts(request, response, requestOpts)) {
        const user = beforeHandlerUser || userGetter(request);

        const functionArguments = {
          user_id: user.id,
          user_traits: user,
          context: {
            ip: request.ip, // x-remote-addr|| x-forwarded-for[0] || x-real-ip
            client_id: request.cookies.__cid, // x-castle-client-id
            headers: request.headers,
          },
        };
        try {
          if (requestOpts.event === EVENTS.LOGIN_SUCCEEDED) {
            return castle
              .authenticate(functionArguments)
              .then(r => {
                console.log('finished', response.finished);
                if (response.finished) {
                  // tslint:disable-next-line:no-empty
                  return () => {};
                }
                console.log('action', r.action);
                if (r.action === 'deny') {
                  console.log('call fail');
                  response.clearCookie('login');
                  request.session = null;
                  response.status(400);
                  return originalSend.apply(response, ['']);
                }
              })
              .catch(e => console.error(e));
          } else {
            castle.trackEvent({
              event: requestOpts.event,
              ...functionArguments,
            });
            return originalSend.apply(response, arguments);
          }
        } catch (e) {
          throw e;
        }
      }

      return originalSend.apply(response, arguments);
    };

    next();
  };
};
