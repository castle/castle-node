export enum EventType {
  CHALLENGE = '$challenge',
  CUSTOM = '$custom',
  LOGIN = '$login',
  LOGOUT = '$logout',
  PASSWORD_RESET_REQUEST = '$password_reset_request',
  PROFILE_RESET = '$profile_reset',
  PROFILE_UPDATE = '$profile_update',
  REGISTRATION = '$registration',
  TRANSACTION = '$transaction',
}

export enum EventStatus {
  ATTEMPTED = '$attempted',
  FAILED = '$failed',
  REQUESTED = '$requested',
  SUCCEEDED = '$succeeded',
}
