"use strict";
/**
 * Created by Chandandeep Singh on 21 August 2019.
 */
const Controller = require("../Controllers");
const UniversalFunctions = require("../Utils/UniversalFunctions");
const Config = require("../Config");
const BaseJoi = require("joi");
const Extension = require("joi-date-extensions");
const Joi = BaseJoi.extend(Extension);
const ejs = require("ejs");
var Boom = require("boom");
const Authenticate = UniversalFunctions.getTokenFromDB;

let user = [
  //*****Route to create/Add new shop*********//
  {
    method: "POST",
    path: "/Shop/create",
    config: {
      description: "add new shop",
      tags: ["api", "Shop"],
      // pre: [{ method:Authenticate , assign: 'verify' }],
      handler: async (request, reply) => {
        try {
          let userRes = await Controller.UserController.createShop(
            request.payload
          );
          return UniversalFunctions.sendSuccess(null, userRes);
        } catch (err) {
          return UniversalFunctions.sendError(err);
        }
      },
      validate: {
        failAction: UniversalFunctions.failActionFunction,
        payload: {
          shopName: Joi.string().required(),
          category: Joi.string().required(),
          Address: Joi.string().required(),
          ownerName: Joi.string().required(),
          coordinates: Joi.array().required()
        }
        //  headers: Joi.object({ 'authorization': Joi.string().trim().required() }).options({ allowUnknown: true })
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages:
            UniversalFunctions.CONFIG.APP_CONSTANTS
              .swaggerDefaultResponseMessages
        }
      }
    }
  },

  //*****Route to Get list of shops*********//

  {
    method: "GET",
    path: "/Shop/list",
    config: {
      description: "List  shop",
      tags: ["api", "Shop"],
      // pre: [{ method:Authenticate , assign: 'verify' }],
      handler: async (request, reply) => {
        try {
          let userRes = await Controller.UserController.getShopList(
            request.query
          );
          return UniversalFunctions.sendSuccess(null, userRes);
        } catch (err) {
          return UniversalFunctions.sendError(err);
        }
      },
      validate: {
        failAction: UniversalFunctions.failActionFunction,
        query: {
          shopName: Joi.string(),
          lat:Joi.number(),
          long:Joi.number(),
          skip: Joi.number().required(),
          limit: Joi.number().required()
        }
        //  headers: Joi.object({ 'authorization': Joi.string().trim().required() }).options({ allowUnknown: true })
      },
      plugins: {
        "hapi-swagger": {
          payloadType: "form",
          responseMessages:
            UniversalFunctions.CONFIG.APP_CONSTANTS
              .swaggerDefaultResponseMessages
        }
      }
    }
  }
];

module.exports = user;
