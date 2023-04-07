export const DEFAULT_API_URL = 'https://api.castle.io/v1';
export const DEFAULT_TIMEOUT = 1500;
export const DEFAULT_ALLOWLIST = [
  'accept',
  'accept-charset',
  'accept-datetime',
  'accept-encoding',
  'accept-language',
  'cache-control',
  'connection',
  'content-length',
  'content-type',
  'dnt',
  'host',
  'origin',
  'pragma',
  'referer',
  'sec-fetch-dest',
  'sec-fetch-mode',
  'sec-fetch-site',
  'sec-fetch-user',
  'te',
  'upgrade-insecure-requests',
  'user-agent',
  'x-requested-with',
];
export const TRUSTED_PROXIES = [
  new RegExp(
    [
      /^127\.0\.0\.1$|/,
      /^(10|172\.(1[6-9]|2[0-9]|30|31)|192\.168)\.|/,
      /^::1\Z|\Afd[0-9a-f]{2}:.+|/,
      /^localhost$|/,
      /^unix$|/,
      /^unix:/,
    ]
      .map((r) => r.source)
      .join('')
  ),
];
export const API = {
  FILTER: 'filter',
  RISK: 'risk'
};
export const EVENT_TYPE = {
  CHALLENGE: '$challenge',
  CUSTOM: '$custom',
  LOGIN: '$login',
  LOGOUT: '$logout',
  PASSWORD_RESET_REQUEST: '$password_reset_request',
  PROFILE_RESET: '$profile_reset',
  PROFILE_UPDATE: '$profile_update',
  REGISTRATION: '$registration',
  TRANSACTION: '$transaction'
};
export const STATUS = {
  ATTEMPTED: '$attempted',
  FAILURE: '$failure',
  REQUESTED: '$requested',
  SUCCEEDED: '$succeeded'
};
export const ACTION = {
  ALLOW: 'allow',
  CHALLENGE: 'challenge',
  DENY: 'deny'
};
