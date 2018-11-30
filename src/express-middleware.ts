import { Request, Response, NextFunction } from 'express';
import { Castle } from './Castle';

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
  userIdGetter: (request: Request) => string;
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
  { userIdGetter, routes }: CastleMwOptions
) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const beforeHandlerUserId = userIdGetter(request);

    response.on('finish', async () => {
      const requestOpts = routes[request.originalUrl];

      if (requestMatchesOpts(request, response, requestOpts)) {
        const userId = userIdGetter(request);
        const requestData: RequestData = {
          cookie: request.cookies.__cid,
          headers: request.headers,
          ip: request.ip,
          userAgent: request.headers['user-agent'],
        };

        // tslint:disable-next-line:no-console
        console.log('TRACKEVENT', {
          event: requestOpts.event,
          user_id: userId || beforeHandlerUserId,
          ...requestData,
        });
        try {
          await castle.trackEvent({
            event: requestOpts.event,
            user_id: userId || beforeHandlerUserId,
            user_traits: {},
            context: {
              ip: request.ip,
              client_id: request.cookies.__cid,
              headers: request.headers,
            },
          });
        } catch (e) {
          // tslint:disable-next-line:no-console
          console.error(e);
        }
      }
    });

    next();
  };
};
