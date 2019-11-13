'use strict';

/**
 * Created by Chandandeep Singh on 21 August 2019.
 */

//External Dependencies
const Hapi = require('hapi');
const Pack = require('./package');
const Config = require('./Config');
const Routes = require('./Routes');
const HapiSwagger = require('hapi-swagger');
const Plugins = require('./Plugins');
const Inert = require('inert');
const Vision = require('vision');
const Model = require('./models')
const userService=require('./Services/UserService')
let md5 = require('md5');

(async () => {

    

    const server = await new Hapi.Server({
        host: '0.0.0.0',
        port: Config.APP_CONSTANTS.SERVER.PORTS.HAPI,
        routes: { cors: true },
        app: {
            name: Config.APP_CONSTANTS.SERVER.APP_NAME
        }
    });

    const swaggerOptions = {
        info: {
            title: 'API Documentation Shopping_List',
            version: Pack.version,
        },
    };
    

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);
        
    // Model.USER.createIndex({shopName: "text"})
    // let SuperAdmin=()=>{
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //         let result= await userService.Find({role:'SUPERADMIN'},{ "__v" : 0});
    //         if(result.length==0){
    //             let res = await   userService.Insert({
    //                 name:"SuperAdmin",
    //                 role:"SUPERADMIN",
    //                 email:"superadmin@yopmail.com",
    //                 password:md5("childcare@!123")
    //             })
    //             return resolve(res)
    //         }else{
    //          console.log("==superadmin==exists")
    //         }
    //         }catch(err){
    //          return reject(err)
    //         }
    //     })SUPERADMIN
    // };
    //  SuperAdmin()
    // let Admin=()=>{
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //         let result= await userService.Find({role:'ADMIN'},{ "__v" : 0});
    //         if(result.length==0){
    //             let res = await   userService.Insert({
    //                 name:"Admin",
    //                 role:"ADMIN",
    //                 email:"admin@yopmail.com",
    //                 password:md5("childcare@!1234")
    //             })
    //             return resolve(res)
    //         }else{
    //          console.log("==Admin==exists")
    //         }
    //         }catch(err){
    //          return reject(err)
    //         }
    //     })
    // };
    // Admin()

    //Bootstrap admin data
    // Bootstrap.bootstrapAdmin(function (err, message) {
    //     if (err) {
    //         console.log('Error while bootstrapping admin : ' + err)
    //     } else {
    //         console.log(message);
    //     }
    // });

    try {
        await server.start();
        console.log('Server running at:', server.info.uri);
    } catch (err) {
        console.log(err);
    }

    server.route(Routes);
})();









