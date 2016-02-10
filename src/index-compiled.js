'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _restify = require('restify');

var _restify2 = _interopRequireDefault(_restify);

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

var _expressCompiled = require('./express-compiled.js');

var _expressCompiled2 = _interopRequireDefault(_expressCompiled);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _eventsCompiled = require('./events-compiled.js');

var _eventsCompiled2 = _interopRequireDefault(_eventsCompiled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Castle = function () {

    /**
     *
     * @param apiKey
     * @param apiSecret
     */

    function Castle(_ref) {
        var _ref$apiKey = _ref.apiKey;
        var apiKey = _ref$apiKey === undefined ? null : _ref$apiKey;
        var apiSecret = _ref.apiSecret;
        var _ref$disableClientUse = _ref.disableClientUserAgent;
        var disableClientUserAgent = _ref$disableClientUse === undefined ? false : _ref$disableClientUse;
        var _ref$apiUrl = _ref.apiUrl;
        var apiUrl = _ref$apiUrl === undefined ? 'https://api.castle.io' : _ref$apiUrl;

        _classCallCheck(this, Castle);

        this.apiKey = apiKey;
        this.apiSecret = apiSecret;
        this.disableClientUserAgent = disableClientUserAgent;
        this.client = _restify2.default.createJsonClient({ url: this.apiUrl });
        this.getClient().basicAuth('', apiSecret);
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

    _createClass(Castle, [{
        key: 'trackEvent',
        value: function trackEvent(_ref2) {
            var _this = this;

            var event = _ref2.event;
            var user_id = _ref2.user_id;
            var _ref2$details = _ref2.details;
            var details = _ref2$details === undefined ? undefined : _ref2$details;
            var _ref2$headers = _ref2.headers;
            var headers = _ref2$headers === undefined ? {} : _ref2$headers;
            var _ref2$ip = _ref2.ip;
            var ip = _ref2$ip === undefined ? undefined : _ref2$ip;
            var _ref2$cookie = _ref2.cookie;
            var cookie = _ref2$cookie === undefined ? '' : _ref2$cookie;
            var _ref2$userAgent = _ref2.userAgent;
            var userAgent = _ref2$userAgent === undefined ? '' : _ref2$userAgent;

            return new Promise(function (resolve, reject) {
                if (event === undefined || event === null || event === "") {
                    return reject(new Error('Missing event', 'MISSING_EVENT_NAME'));
                }

                var postData = {
                    name: event,
                    user_id: user_id,
                    details: details
                };
                _this.getClient().post({
                    path: '/v1/events',
                    headers: _this.generateHeaders(headers, ip, cookie, userAgent)
                }, postData, function (error, request, response, obj) {
                    if (error) {
                        return reject(error);
                    } else if (request.statusCode < 200 || request.statusCode >= 300) {
                        return reject(new Error('Invalid HTTP Status Code ' + request.statusCode, 'INVALID_HTTP_STATUS_CODE'));
                    }
                    return resolve(obj);
                });
            });
        }
    }, {
        key: 'identify',
        value: function identify(_ref3) {
            var _this2 = this;

            var user_id = _ref3.user_id;
            var user_data = _ref3.user_data;
            var _ref3$headers = _ref3.headers;
            var headers = _ref3$headers === undefined ? {} : _ref3$headers;
            var _ref3$ip = _ref3.ip;
            var ip = _ref3$ip === undefined ? undefined : _ref3$ip;
            var _ref3$cookie = _ref3.cookie;
            var cookie = _ref3$cookie === undefined ? '' : _ref3$cookie;
            var _ref3$userAgent = _ref3.userAgent;
            var userAgent = _ref3$userAgent === undefined ? '' : _ref3$userAgent;

            return new Promise(function (resolve, reject) {
                _this2.getClient().put({
                    path: '/v1/users/' + user_id,
                    headers: _this2.generateHeaders(headers, ip, cookie, userAgent)
                }, user_data, function (error, request, response, obj) {
                    if (error) {
                        return reject(error);
                    } else if (request.statusCode < 200 || request.statusCode >= 300) {
                        return reject(new Error('Invalid HTTP Status Code ' + request.statusCode, 'INVALID_HTTP_STATUS_CODE'));
                    }
                    return resolve(obj);
                });
            });
        }
    }, {
        key: 'generateHeaders',
        value: function generateHeaders(clientHeaders, ip, cookie, userAgent) {
            return this.stripUndefinedVariables({
                'X-Castle-Ip': ip,
                'X-Castle-Cookie-Id': cookie,
                'X-Castle-User-Agent': userAgent,
                'X-Castle-Headers': JSON.stringify(clientHeaders),
                'X-Castle-Client-User-Agent': this.isClientUserAgentDisabled() ? undefined : this.getClientUserAgent()
            });
        }
    }, {
        key: 'stripUndefinedVariables',
        value: function stripUndefinedVariables(obj) {
            var toReturn = {};
            Object.keys(obj).forEach(function (k) {
                var v = obj[k];
                if (v !== undefined && v !== null) {
                    toReturn[k] = v;
                }
            });
            return toReturn;
        }
    }, {
        key: 'getClient',
        value: function getClient() {
            return this.client;
        }

        /**
         *
         * @returns {{}}
         */

    }, {
        key: 'getClientUserAgent',
        value: function getClientUserAgent() {
            return {
                bindings_version: _package2.default.version,
                lang: 'Node.js',
                lang_version: process.version,
                platform: _os2.default.platform(),
                publisher: 'castle'
            };
        }
    }, {
        key: 'isClientUserAgentDisabled',
        value: function isClientUserAgentDisabled() {
            return this.disableClientUserAgent || false;
        }
    }], [{
        key: 'express',
        value: function express(opts) {
            var castle = new Castle(opts);
            return (0, _expressCompiled2.default)(castle);
        }
    }]);

    return Castle;
}();

Castle.Events = _eventsCompiled2.default;

module.exports = Castle;

//# sourceMappingURL=index-compiled.js.map