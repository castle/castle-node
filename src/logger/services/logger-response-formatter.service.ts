export const LoggerResponseFormatterService = {
  call: (response: Response, body: any) =>
    `
Response status: ${response.status}
Response body: ${JSON.stringify(body)}
`.trim(),
};
