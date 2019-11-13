const Hapi = require('hapi');
const Pack = require('./package');
const Config = require('./Config');
var Routes = require('./Routes');
const HapiSwagger = require('hapi-swagger');
var Plugins = require('./Plugins');
const Inert = require('inert');
const Vision = require('vision');
let server = Hapi.server();

const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: Pack.version,
    },
};

server.register([
    Inert,
    Vision,
    {
        plugin: HapiSwagger,
        options: swaggerOptions
    }
]);


server.route(Routes);

exports.handler = async (event, context, callback) => {
    // const options = {
    //     "url": event.path,
    //     "headers": event.headers,
    // };
    context.callbackWaitsForEmptyEventLoop = false;
    const options = {
        method: event.http_method,
        url: event.path,
        payload: event.body,
        headers: event.headers,
        validate: false
    };
    let a = await server.inject(options);
    return callback(null, a.result);
};