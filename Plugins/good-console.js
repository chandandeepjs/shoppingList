'use strict';
/**
 * Created by Chandandeep Singh on 21 August 2019.
 */
var Good = require('good');

//Register Good Console

exports.register = function(server, options, next){

    server.register({
        register: Good,
        options: {
            reporters: [{
                reporter: require('good-console'),
                events: {
                    response: '*',
                    log: '*'
                }
            }]
        }
    }, function (err) {
        if (err) {
            throw err;
        }
    });

    next();
};

exports.register.attributes = {
    name: 'good-console-plugin'
};