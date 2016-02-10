'use strict';

import restify from 'restify';
import packageJSON from '../package.json'
import ExpressWrapper from'./express-compiled.js';
import OS from 'os';

class Castle {

    /**
     *
     * @param apiKey
     * @param apiSecret
     */
    constructor({apiKey = null, apiSecret, disableClientUserAgent = false}) {
        this.apiKey                 = apiKey;
        this.apiSecret              = apiSecret;
        this.disableClientUserAgent = disableClientUserAgent;
        this.client                 = restify.createJsonClient({url : 'https://api.castle.io'});
        this.getClient().basicAuth('call-the-cops-i-dont-give-a-fck', apiSecret);
    }

    /**
     *
     * @param {string} event the event you want to track. This can be custom or one from Castle.Events
     * @param {string} user_id the id of the affected user (If known)
     * @param {object} details [optional] other details for the event. EX: the $login parameter for emails
     * @param {object} headers [optional] the HTTP headers sent by the user/client
     * @param {string} ip [optional] the user/client's IP Address
     * @param {string} cookie [optional] the castle cookie left by the clientside javascript sdk
     * @returns {Promise}
     */
    trackEvent({event, user_id, details = undefined, headers = {}, ip = undefined, cookie = '', userAgent = ''}) {
        return new Promise((resolve, reject) => {
            if (event === undefined || event === null || event === "") {
                return reject(new Error('Missing event', 'MISSING_EVENT_NAME'));
            }

            var postData = {
                name    : event,
                user_id : user_id,
                details : details
            };
            this.getClient().post({
                path    : '/v1/events',
                headers : this.generateHeaders(headers, ip, cookie, userAgent)
            }, postData, (error, request, response, obj) => {
                if (error) {
                    return reject(error);
                } else if (request.statusCode < 200 || request.statusCode >= 300) {
                    return reject(new Error(`Invalid HTTP Status Code ${request.statusCode}`, 'INVALID_HTTP_STATUS_CODE'))
                }
                return resolve(obj);
            });
        });
    }

    identify({user_id, user_data, headers = {}, ip = undefined, cookie = '', userAgent = ''}) {
        return new Promise((resolve, reject) => {
            this.getClient().put({
                path    : `/v1/users/${user_id}`,
                headers : this.generateHeaders(headers, ip, cookie, userAgent)
            }, user_data, (error, request, response, obj) => {
                if (error) {
                    return reject(error);
                } else if (request.statusCode < 200 || request.statusCode >= 300) {
                    return reject(new Error(`Invalid HTTP Status Code ${request.statusCode}`, 'INVALID_HTTP_STATUS_CODE'))
                }
                return resolve(obj);
            });
        });
    }

    generateHeaders(clientHeaders, ip, cookie, userAgent) {
        return this.stripUndefinedVariables({
            'X-Castle-Ip'                : ip,
            'X-Castle-Cookie-Id'         : cookie,
            'X-Castle-User-Agent'        : userAgent,
            'X-Castle-Headers'           : JSON.stringify(clientHeaders),
            'X-Castle-Client-User-Agent' : this.isClientUserAgentDisabled() ? undefined : this.getClientUserAgent()
        });
    }

    stripUndefinedVariables(obj) {
        var toReturn = {};
        Object.keys(obj).forEach(k => {
            var v = obj[k];
            if (v !== undefined && v !== null) {
                toReturn[k] = v;
            }
        });
        return toReturn;
    }

    express(opts) {
        var castle = new Castle(opts);
        return ExpressWrapper(castle);
    }

    getClient() {
        return this.client;
    }

    /**
     *
     * @returns {{}}
     */
    getClientUserAgent() {
        return {
            bindings_version : packageJSON.version,
            lang             : 'Node.js',
            lang_version     : process.version,
            platform         : OS.platform(),
            publisher        : 'castle'
        }
    }

    isClientUserAgentDisabled() {
        return this.disableClientUserAgent || false;
    }

}

/**
 *
 * This is used for easy access to the different DEFAULT events
 *
 * @type {{LOGIN_SUCCEEDED: string, LOGIN_FAILED: string, LOGOUT_SUCCEEDED: string, REGISTRATION_SUCCEEDED: string, REGISTRATION_FAILED: string, EMAIL_CHANGE_REQUESTED: string, EMAIL_CHANGE_SUCCEEDED: string, EMAIL_CHANGE_FAILED: string, PASSWORD_RESET_REQUESTED: string, PASSWORD_RESET_SUCCEEDED: string, PASSWORD_RESET_FAILED: string, PASSWORD_CHANGE_SUCCEEDED: string, PASSWORD_CHANGE_FAILED: string, CHALLENGE_REQUESTED: string, CHALLENGE_SUCCEEDED: string, CHALLENGE_FAILED: string}}
 */
Castle.Events = {
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

module.exports = Castle;
