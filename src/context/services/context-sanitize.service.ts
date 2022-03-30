export const ContextSanitizeService = {
  call: (context: undefined | { [key: string]: any }) => {
    if (!context) {
      return {};
    }

    if (!('active' in context)) {
      return context;
    }

    if (typeof context.active === 'boolean') {
      return context;
    }

    delete context.active;

    return context;
  },
};
