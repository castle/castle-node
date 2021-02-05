import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  UserUnauthorizedError,
  InvalidParametersError,
  InternalServerError,
} from '../../errors';

const RESPONSE_ERRORS = {
  '400': BadRequestError,
  '401': UnauthorizedError,
  '403': ForbiddenError,
  '404': NotFoundError,
  '419': UserUnauthorizedError,
  '422': InvalidParametersError,
};

export const CoreProcessResponseService = {
  call: (response: Response) => {
    if (response.status >= 200 && response.status <= 299) {
      return;
    }

    if (response.status >= 500 && response.status <= 599) {
      throw new InternalServerError(
        `Castle: Responsed with ${response.status} code`
      );
    }

    const err = RESPONSE_ERRORS[response.status.toString()];

    throw new err(`Castle: Responsed with ${response.status} code`);
  },
};
