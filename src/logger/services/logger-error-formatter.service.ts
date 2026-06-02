export const LoggerErrorFormatterService = {
  call: (err?: Error) =>
    err
      ? `
Error name: ${err.name}
Error message: ${err.message}
`.trim()
      : '',
};
