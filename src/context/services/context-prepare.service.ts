export const ContextPrepareService = {
  call: (context: any) => {
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
