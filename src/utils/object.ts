const isPlainObject = (value: unknown): value is Record<string, any> =>
  Object.prototype.toString.call(value) === '[object Object]';

/**
 * Recursively merges own enumerable properties of the source objects into the
 * target, mutating and returning the target. Mirrors the subset of
 * `lodash.merge` semantics this SDK relies on: deep merge of plain objects and
 * arrays (by index), with `undefined` source values skipped.
 */
export const deepMerge = (target: any, ...sources: any[]): any => {
  for (const source of sources) {
    if (source === null || source === undefined) {
      continue;
    }

    for (const key of Object.keys(source)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (sourceValue === undefined) {
        continue;
      }

      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        deepMerge(targetValue, sourceValue);
      } else if (Array.isArray(sourceValue) && Array.isArray(targetValue)) {
        deepMerge(targetValue, sourceValue);
      } else if (isPlainObject(sourceValue)) {
        target[key] = deepMerge({}, sourceValue);
      } else if (Array.isArray(sourceValue)) {
        target[key] = deepMerge([], sourceValue);
      } else {
        target[key] = sourceValue;
      }
    }
  }

  return target;
};

/**
 * Returns `true` for `null`/`undefined`, empty strings/arrays, empty
 * `Map`/`Set`, and objects with no own enumerable keys. Matches the
 * `lodash.isempty` behavior used by the context builder.
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) {
    return true;
  }

  if (Array.isArray(value) || typeof value === 'string') {
    return value.length === 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  return true;
};

/**
 * Returns a shallow copy of `object` keeping only the entries whose values are
 * truthy. Equivalent to `lodash.pickby(object)` with the default identity
 * predicate.
 */
export const pickByTruthy = <T extends Record<string, any>>(
  object: T
): Partial<T> =>
  Object.entries(object).reduce<Partial<T>>((accumulator, [key, value]) => {
    if (value) {
      (accumulator as Record<string, any>)[key] = value;
    }
    return accumulator;
  }, {});
