export const EVENTS = {
  // Record when a user succesfully logs in.
  LOGIN_SUCCEEDED: '$login.succeeded',
  // Record when a user failed to log in.
  LOGIN_FAILED: '$login.failed',
  // Record when a user logs out.
  LOGOUT_SUCCEEDED: '$logout.succeeded',
  // Capture account creation, both when a user signs up as well as when created manually by an administrator.
  REGISTRATION_SUCCEEDED: '$registration.succeeded',
  // Record when an account failed to be created.
  REGISTRATION_FAILED: '$registration.failed',
  // An attempt was made to change a user’s email.
  EMAIL_CHANGE_REQUESTED: '$email_change.requested',
  // The user completed all of the steps in the email address change process and the email was successfully changed.
  EMAIL_CHANGE_SUCCEEDED: '$email_change.succeeded',
  // Use to record when a user failed to change their email address.
  EMAIL_CHANGE_FAILED: '$email_change.failed',
  // An attempt was made to reset a user’s password.
  PASSWORD_RESET_REQUESTED: '$password_reset.requested',
  // The user completed all of the steps in the password reset process and the password was successfully reset. Password resets do not required knowledge of the current password.
  PASSWORD_RESET_SUCCEEDED: '$password_reset.succeeded',
  // Use to record when a user failed to reset their password.
  PASSWORD_RESET_FAILED: '$password_reset.failed',
  // Use to record when a user changed their password. This event is only logged when users change their own password.
  PASSWORD_CHANGE_SUCCEEDED: '$password_change.succeeded',
  // Use to record when a user failed to change their password.
  PASSWORD_CHANGE_FAILED: '$password_change.failed',
  // Record when a user is prompted with additional verification, such as two-factor authentication or a captcha.
  CHALLENGE_REQUESTED: '$challenge.requested',
  // Record when additional verification was successful.
  CHALLENGE_SUCCEEDED: '$challenge.succeeded',
  // Record when additional verification failed.
  CHALLENGE_FAILED: '$challenge.failed',
};
