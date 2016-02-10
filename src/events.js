'use strict';

/**
 *
 * This is used for easy access to the different DEFAULT events
 *
 * @type {{LOGIN_SUCCEEDED: string, LOGIN_FAILED: string, LOGOUT_SUCCEEDED: string, REGISTRATION_SUCCEEDED: string, REGISTRATION_FAILED: string, EMAIL_CHANGE_REQUESTED: string, EMAIL_CHANGE_SUCCEEDED: string, EMAIL_CHANGE_FAILED: string, PASSWORD_RESET_REQUESTED: string, PASSWORD_RESET_SUCCEEDED: string, PASSWORD_RESET_FAILED: string, PASSWORD_CHANGE_SUCCEEDED: string, PASSWORD_CHANGE_FAILED: string, CHALLENGE_REQUESTED: string, CHALLENGE_SUCCEEDED: string, CHALLENGE_FAILED: string}}
 */

module.exports = {
    LOGIN_SUCCEEDED           : '$login.succeeded', //Record when a user attempts to log in.
    LOGIN_FAILED              : '$login.failed', //Record when a user logs out.
    LOGOUT_SUCCEEDED          : '$logout.succeeded', //Record when a user logs out.
    REGISTRATION_SUCCEEDED    : '$registration.succeeded', //Capture account creation, both when a user signs up as well as when created manually by an administrator.
    REGISTRATION_FAILED       : '$registration.failed', //Record when an account failed to be created.
    EMAIL_CHANGE_REQUESTED    : '$email_change.requested', //An attempt was made to change a user’s email.
    EMAIL_CHANGE_SUCCEEDED    : '$email_change.succeeded', //The user completed all of the steps in the email address change process and the email was successfully changed.
    EMAIL_CHANGE_FAILED       : '$email_change.failed', //Use to record when a user failed to change their email address.
    PASSWORD_RESET_REQUESTED  : '$password_reset.requested', //An attempt was made to reset a user’s password.
    PASSWORD_RESET_SUCCEEDED  : '$password_reset.succeeded', //The user completed all of the steps in the password reset process and the password was successfully reset. Password resets do not required knowledge of the current password.
    PASSWORD_RESET_FAILED     : '$password_reset.failed', //Use to record when a user failed to reset their password.
    PASSWORD_CHANGE_SUCCEEDED : '$password_change.succeeded',//Use to record when a user changed their password. This event is only logged when users change their own password.
    PASSWORD_CHANGE_FAILED    : '$password_change.failed', //Use to record when a user failed to change their password.
    CHALLENGE_REQUESTED       : '$challenge.requested', //Record when a user is prompted with additional verification, such as two-factor authentication or a captcha.
    CHALLENGE_SUCCEEDED       : '$challenge.succeeded', //Record when additional verification was successful.
    CHALLENGE_FAILED          : '$challenge.failed' //Record when additional verification failed.
};