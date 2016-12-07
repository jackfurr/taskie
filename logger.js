var winston = require('winston');
require('winston-daily-rotate-file');
var path = require('path');
var logger;

var logLevels = {
    levels: {
        error: 7,
        warn: 6,
        stats: 5,
        info: 4,
        debug: 3,
        trace: 2,
        fine: 1,
        finer: 0
    },
    labelsByName: {}, // to be filled in below
    labelsByValue: {} // to be filled in below
};
// create strings of uniform length for all the log levels
var longestLevel = winston.longestElement(Object.keys(logLevels.levels));
for (var level in logLevels.levels) {
    var label = (level + Array(longestLevel - level.length + 1).join(' ')).toUpperCase();
    logLevels.labelsByName[level] = label;
    logLevels.labelsByValue[logLevels.levels[level]] = label;
}

exports.startLogger = function(logConfig) {
    try {
        logger = new(winston.Logger)({
            levels: logLevels.levels,
            transports: [
                new(winston.transports.DailyRotateFile)({
                    datePattern: logConfig.date_pattern,
                    filename: logConfig.file,
                    json: false, // needs to be false for custom formatter ;(
                    timestamp: function() {
                        return new Date().toLocaleString();
                    },
                    formatter: function formatWithInstanceInfo(options) {
                        var instanceInfo = '';
                        var userMeta = '';
                        if (options.meta !== null && typeof(options.meta) === 'object' && Object.keys(options.meta).length > 0) {
                            if (options.meta.instanceInfo !== undefined) {
                                instanceInfo = ' ' + options.meta.instanceInfo;
                                var nestedMeta = options.meta.nestedMeta;
                                if (nestedMeta !== undefined && typeof nestedMeta === 'object' && Object.keys(nestedMeta).length > 0) {
                                    userMeta = ' ' + JSON.stringify(nestedMeta);
                                }
                            } else {
                                userMeta = ' ' + JSON.stringify(options.meta);
                            }
                        }
                        // repeat the prefix on each line of the message
                        var prefix = options.timestamp() + ' ' + logLevels.labelsByName[options.level] + instanceInfo;
                        var message = (undefined !== options.message ? options.message : '--') + userMeta;
                        return prefix + ':' + message.split('\n').join('\n' + prefix + ' ');
                    }
                })
            ]
        });

        if (logConfig.log_to_console) {
            logger.add(winston.transports.Console, {
                formatter: function formatWithoutInstanceInfo(options) {
                    var userMeta = '';
                    if (options.meta !== null && typeof(options.meta) === 'object' && Object.keys(options.meta).length > 0) {
                        if (options.meta.instanceInfo !== undefined) {
                            var nestedMeta = options.meta.nestedMeta;
                            if (nestedMeta !== undefined && typeof nestedMeta === 'object' && Object.keys(nestedMeta).length > 0) {
                                userMeta = ' ' + JSON.stringify(nestedMeta);
                            }
                        } else {
                            userMeta = ' ' + JSON.stringify(options.meta);
                        }
                    }
                    return logLevels.labelsByName[options.level] + ' ' + (undefined !== options.message ? options.message : '--') + userMeta;
                }
            });
        }
        logger.level = logConfig.log_level;
        return true;
    } catch (e) {
        console.error('Could not start logger.');
        console.error(e);
        return false;
    }
};

exports.getLogger = function() {
    return logger;
};

function createSingleLogForwarder(targetName) {
    return function forwardToNextLogger() {
        // Inferring from the Winston code, each log() call may end with two optional arguments:  meta (an object) and callback (function), in this order.
        // We shall make our object the meta argument; if the user passed a meta argument of their own, nest it in ours.
        args = Array.prototype.slice.call(arguments);
        var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        var instanceMeta = {
            instanceInfo: this.myInstanceInfo
        };
        var userMetaCandidate = args[args.length - 1];
        if (typeof userMetaCandidate === 'object' && Object.prototype.toString.call(userMetaCandidate) !== '[object RegExp]') {
            // User supplied their own meta -- nest it in our meta.
            instanceMeta.nestedMeta = userMetaCandidate;
            args[args.length - 1] = instanceMeta;
        } else {
            args.push(instanceMeta);
        }
        if (callback) {
            args.push(callback);
        }
        // Now (args) has everything we want to pass to the underlying log function.  That underlying function has the same name Call it with them.
        var functionToCall = this.nextLogger[targetName];
        return functionToCall.apply(this.nextLogger, args);
    };
}

// instanceLogForwarderSet is an object that runs logging calls in all forms (e.g. logger.log(debug, "blah"); and logger.debug("blah"); through the forwarder function above.
exports.instanceLogForwarderSet = {
    log: createSingleLogForwarder('log')
};
for (var level in logLevels.levels) {
    exports.instanceLogForwarderSet[level] = createSingleLogForwarder(level);
}
exports.instanceLogForwarderNames = Object.keys(exports.instanceLogForwarderSet);

exports.createInstanceLogger = function(aInstanceInfo, aLogger) {
    var instanceLogger = {
        myInstanceInfo: aInstanceInfo,
        nextLogger: (aLogger !== undefined ? aLogger : logger)
    };
    for (var i = 0; i < exports.instanceLogForwarderNames.length; i++) {
        instanceLogger[exports.instanceLogForwarderNames[i]] = exports.instanceLogForwarderSet[exports.instanceLogForwarderNames[i]];
    }
    return instanceLogger;
};