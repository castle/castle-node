import { Request, Response, NextFunction } from 'express';
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
  return (request: Request, response: Response, next: NextFunction) => {
    const beforeHandlerUser = userGetter(request);

    response.on('finish', async () => {
      const requestOpts = routes[request.originalUrl];

      if (requestMatchesOpts(request, response, requestOpts)) {
        const user = beforeHandlerUser || userGetter(request);
        const requestData: RequestData = {
          cookie: request.cookies.__cid,
          headers: request.headers,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
        };

        const functionArguments = {
          user_id: user.id,
          user_traits: user,
          context: {
            ip: request.ip,
            client_id: request.cookies.__cid,
            headers: request.headers,
          },
        };
        try {
          if (requestOpts.event === EVENTS.LOGIN_SUCCEEDED) {
            castle.authenticate(functionArguments).then(
              // tslint:disable-next-line:no-console
              r => console.log(`AUTHENTICATION RESPONSE: ${JSON.stringify(r)}`),
              // tslint:disable-next-line:no-console
              e => console.error(`AUTHENTICATION ERROR: ${e}`)
            );
          } else {
            castle.trackEvent({
              event: requestOpts.event,
              ...functionArguments,
            });
          }
        } catch (e) {
          throw e;
        }
      }
    });

    next();
  };
};
