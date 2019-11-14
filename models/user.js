/*
 * @file:users.js
 * @description: This file defines the user schema for mongodb
 * @date: 
 * @author:chandandeep singh
 * */
'use strict'; 
//let configs = require('../../../configs');
//let env = require('../../../env');
//const appCont = configs.app[env.instance];

const Mongoose = require('mongoose'),
Schema = Mongoose.Schema;
Mongoose.set('debug')


const UserSchema = new Schema({
    ownerName        : { type:String},
    shopName         : { type:String},
    Address          : { type:String},
    category         : { type:String},
    location         : {
                          type: {type: String, enum: "Point", default: "Point"},
                         coordinates: {type: [Number]}
                        },
    created_at       : { type:Date,default:Date.now()},
    updated_at       : { type:Number},
    accessToken      : { type:String},
    is_deleted       : { type:Boolean,default:false}
});
UserSchema.index({location: "2dsphere"});
UserSchema.index({shopName:"text"});
module.exports = Mongoose.model('user', UserSchema);
//UserSchema.index({location: "2dsphere"});



