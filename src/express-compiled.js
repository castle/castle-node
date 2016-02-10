'use strict';

var _eventsCompiled = require('./events-compiled.js');

var _eventsCompiled2 = _interopRequireDefault(_eventsCompiled);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (castle) {
    var events = arguments.length <= 1 || arguments[1] === undefined ? _eventsCompiled2.default : arguments[1];

    return function (request, response, next) {
        function injectClientData(data) {
            data.headers = request.headers || undefined;
            data.ip = request.ip || undefined;
            data.cookie = request.cookies['__cid'] || undefined;
            data.userAgent = request.headers['user-agent'] || '';
            return data;
        }

        request.castleTrackEvent = function (event, userID, details) {
            return castle.trackEvent(injectClientData({
                event: event,
                userID: userID,
                details: details
            }));
        };

        request.castleIdentify = function (user_id, user_data) {
            return castle.identify(injectClientData({
                user_id: user_id,
                user_data: user_data
            }));
        };

        request.castleEvents = events;

        next();
    };
};

//# sourceMappingURL=express-compiled.js.map