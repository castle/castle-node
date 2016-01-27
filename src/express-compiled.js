'use strict';

module.exports = function (castle) {
    return function (request, response, next) {

        request.castleTrackEvent = function (event, userID, details) {
            castle.trackEvent({
                event: event,
                userID: userID,
                details: details,
                headers: request.headers || undefined,
                ip: request.ip || undefined,
                cookie: request.cookies['__cid'] || undefined,
                userAgent: request.headers['user-agent'] || ''
            });
        };

        request.castleEvents = castle.Events;

        next();
    };
};

//# sourceMappingURL=express-compiled.js.map