export const CoreGenerateRequestBody = {
  call: (payload: { [key: string]: any }): string => {
    return JSON.stringify({
      sent_at: new Date().toISOString(),
      ...payload,
    });
  },
};
