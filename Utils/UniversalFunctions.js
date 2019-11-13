'use strict'
/**
 * Created by Chandandeep Singh on 21 August 2019.
 */
var Joi = require('joi');
var async = require('async');
var MD5 = require('md5');
var Boom = require('boom');
var CONFIG = require('../Config');
var Models = require('../models');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var randomstring = require("randomstring");
var STATUS_MESSAGE = CONFIG.APP_CONSTANTS.STATUS_MSG;
var ERROR_MESSAGE = STATUS_MESSAGE.ERROR;

var VALID_ERRAND_STATUS_ARRAY = [];
var USER_ROLES = CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES;

for (var key in CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS) {
    if (CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS.hasOwnProperty(key)) {
        VALID_ERRAND_STATUS_ARRAY.push(CONFIG.APP_CONSTANTS.DATABASE.ERRANDS_STATUS[key])
    }
}

let generateAuthToken = (userData) => {
    let expTime = Math.floor(Date.now() / 1000) + (60 * 60 * 7)
    let jwtToken = jwt.sign({ exp: expTime, data: userData }, CONFIG.APP_CONSTANTS.JWT_KEY);
    return jwtToken;
}

let getTokenFromDB = (request, res) => {
    let token = (request.payload != null && (request.payload.authorization)) ? request.payload.authorization : ((request.params && request.params.authorization) ? request.params.authorization : request.headers['authorization']);
    return new Promise(async(resolve,reject)=>{
        try {  
            let decoded = await jwt.verify(token, CONFIG.APP_CONSTANTS.JWT_KEY);
            let userData = await decoded.data;
            userData.authorization = token;
            let checkTokenData = await checkAdminToken(userData);
            return resolve(checkTokenData);
        } catch (err) { 
            let error 
            if(err.message === "jwt expired"){
                error = Boom.unauthorized("TOKEN_EXPIRED")
                return reject(error)
            }
            error = Boom.unauthorized("INVALID_TOKEN")
            return reject(error)  
        }
   
    })  
};

let checkAdminToken = (payloadData) => {
    let criteria = {
        _id: payloadData.id,
        accessToken: payloadData.authorization
    }; 
    let projection = { password: 0, __v: 0 };
    return new Promise(async(resolve,reject)=>{
        try {
            let userData = await Models.USER.find(criteria, projection, { lean: true });
            if (userData.length == 0) {
                let error = Boom.unauthorized("INVALID_TOKEN")
                return reject(error)  
            }
            return resolve(userData[0]);
        } catch (err) {
           let error = Boom.unauthorized("INVALID_TOKEN")
            return reject(error)  
        }
    })
   
};

let sendError = function (data) {console.log("=====sendError===========+++++++++",data)
    if (typeof data == 'object' && data.hasOwnProperty('statusCode') && data.hasOwnProperty('customMessage')) {console.log("=======111111111")
        var errorToSend = data//Boom.badRequest(data.customMessage, data.statusCode);
        console.log("====errorToSend====",errorToSend)
       // errorToSend.output.payload.responseType = data.type;
        return errorToSend;
    } else if (data.code === 11000 ) {
        return CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE;
    } else {console.log("=======2222222222222")
        const error = Boom.forbidden(data);
        error.reformat();
        return error;
    }
};

var sendSuccess = function (successMsg, data) {
    successMsg = successMsg || CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage;
    if (typeof successMsg == 'object' && successMsg.hasOwnProperty('statusCode') && successMsg.hasOwnProperty('customMessage')) {
        return { statusCode: successMsg.statusCode, message: successMsg.customMessage, data: data || null };

    } else {
        return { statusCode: 200, message: successMsg, data: data || null };

    }
};

var failActionFunction = function (request, reply, source, error) {
    var customErrorMessage = '';
    if (source.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = source.output.payload.message.substr(source.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = source.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    //   customErrorMessage = capitalize(customErrorMessage);
    source.output.payload.message = customErrorMessage;
    delete source.output.payload.validation
    return source;
};


var customQueryDataValidations = function (type, key, data, callback) {
    var schema = {};
    switch (type) {
        case 'PHONE_NO': schema[key] = Joi.string().regex(/^[0-9]+$/).length(10);
            break;
        case 'NAME': schema[key] = Joi.string().regex(/^[a-zA-Z ]+$/).min(2);
            break;
        case 'BOOLEAN': schema[key] = Joi.boolean();
            break;
    }
    var value = {}; getTokenFromDB
    value[key] = data;

    Joi.validate(value, schema, callback);
};


var authorizationHeaderObj = Joi.object({
    authorization: Joi.string().required()
}).unknown();

var getEmbeddedDataFromMongo = function (dataAry, keyToSearch, referenceIdToSearch, embeddedFieldModelName, variableToAttach, callback) {
    if (!dataAry || !keyToSearch || !variableToAttach || !embeddedFieldModelName || !Models[embeddedFieldModelName]) {
        callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
    } else {
        if (dataAry.length > 0) {
            var taskToRunInParallel = [];
            dataAry.forEach(function (dataObj) {
                taskToRunInParallel.push((function (dataObj) {
                    return function (embeddedCB) {
                        if (!dataObj[referenceIdToSearch]) {
                            callback(CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR)
                        } else {
                            var criteria = {};
                            criteria[keyToSearch] = dataObj[referenceIdToSearch];
                            Models[embeddedFieldModelName].find(criteria, function (err, modelDataAry) {
                                if (err) {
                                    embeddedCB(err)
                                } else {
                                    if (modelDataAry) {
                                        dataObj[variableToAttach] = modelDataAry
                                    }
                                    embeddedCB()
                                }
                            })
                        }

                    }
                })(dataObj));
            });

            async.parallel(taskToRunInParallel, function (err, result) {
                if (err) {
                    callback(err)
                } else {
                    callback(null, dataAry)
                }
            })

        } else {
            callback(null, dataAry)
        }
    }
};

var CryptData = function (stringToCrypt) {
    return MD5(MD5(stringToCrypt));
};
   
var generateRandomString = function () {
    return randomstring.generate(7);
};

var filterArray = function (array) {
    return array.filter(function (n) {
        return n != undefined && n != ''
    });
};

var sanitizeName = function (string) {
    return filterArray(string && string.split(' ') || []).join(' ')
};

var verifyEmailFormat = function (string) {
    return validator.isEmail(string)
};

var deleteUnnecessaryUserData = function (userObj) {
    delete userObj['__v'];
    delete userObj['password'];
    delete userObj['accessToken'];
    delete userObj['emailVerificationToken'];
    delete userObj['passwordResetToken'];
    delete userObj['registrationDate'];
    delete userObj['OTPCode'];
    delete userObj['facebookId'];
    delete userObj['codeUpdatedAt'];
    delete userObj['deviceType'];
    delete userObj['deviceToken'];
    delete userObj['appVersion'];
    delete userObj['isBlocked'];
    return userObj;
};

var deleteUnnecessarySupplierData = function (supplierObj) {
    //console.log('deleting>>',supplierObj)
    delete supplierObj['__v'];
    delete supplierObj['password'];
    delete supplierObj['_id'];
    delete supplierObj['accessToken'];
    delete supplierObj['drivers'];
    delete supplierObj['passwordResetToken'];
    delete supplierObj['registrationDate'];
    delete supplierObj['lastLogin'];
    delete supplierObj['timestamp'];
    return supplierObj;
};

module.exports = {
    sendError: sendError,
    sendSuccess: sendSuccess,
    generateAuthToken: generateAuthToken,
    getTokenFromDB: getTokenFromDB,
    CryptData: CryptData,
    failActionFunction: failActionFunction,
    authorizationHeaderObj: authorizationHeaderObj,
    getEmbeddedDataFromMongo: getEmbeddedDataFromMongo,
    verifyEmailFormat: verifyEmailFormat,
    sanitizeName: sanitizeName,
    deleteUnnecessaryUserData: deleteUnnecessaryUserData,
    filterArray: filterArray,
    CONFIG: CONFIG,
    VALID_ERRAND_STATUS_ARRAY: VALID_ERRAND_STATUS_ARRAY,
    generateRandomString: generateRandomString,
    customQueryDataValidations: customQueryDataValidations

};