'use strict';

import restify from 'restify';
import packageJSON from '../package.json'
import ExpressWrapper from'./express-compiled.js';
import OS from 'os';
import Events from './events-compiled.js';

class Castle {

    /**
     *
     * @param apiKey
     * @param apiSecret
     */
    constructor({apiKey = null, apiSecret, apiUrl = 'https://api.castle.io', disableClientUserAgent = false}) {
        this.apiKey                 = apiKey;
        this.apiSecret              = apiSecret;
        this.disableClientUserAgent = disableClientUserAgent;
        this.apiUrl                 = apiUrl;
        this.client                 = restify.createJsonClient({url : apiUrl});
        this.getClient().basicAuth('test', apiSecret);
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
            'X-Castle-Client-User-Agent' : this.isClientUserAgentDisabled() ? undefined : JSON.stringify(this.getClientUserAgent())
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

    static express(opts) {
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

Castle.Events = Events;

module.exports = Castle;
