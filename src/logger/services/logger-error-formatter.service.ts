export const LoggerErrorFormatterService = {
  call: (err: Error) =>
    `
Error name: ${err.name}
Error message: ${err.message}
`.trim(),
};
