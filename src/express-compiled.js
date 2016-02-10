'use strict';

module.exports = function (castle) {
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

        request.castleIdentifyUser = function (user_id, user_data) {
            return castle.identify(injectClientData({
                user_id: user_id,
                user_data: user_data
            }));
        };

        request.castleEvents = castle.Events;

        next();
    };
};

//# sourceMappingURL=express-compiled.js.map