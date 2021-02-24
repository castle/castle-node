import { InvalidParametersError } from '../../errors';

export const ValidatorPresentService = {
  call: (options: object, keys: string[]) => {
    for (const key of keys) {
      if (options[key]) {
        continue;
      }

      throw new InvalidParametersError(`Castle: ${key} is missing or empty`);
    }
  },
};
