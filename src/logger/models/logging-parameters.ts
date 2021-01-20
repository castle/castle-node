export type LoggingParameters = {
  requestUrl: string;
  requestOptions: any;
  response?: Response;
  err?: Error;
  body?: any;
};
