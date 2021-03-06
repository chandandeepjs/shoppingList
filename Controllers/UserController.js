"use strict";
const Service = require("../Services");
const Config = require("../Config");
const moment = require("moment");
let md5 = require("md5");
let path = require("path");
let fs = require("fs");
let Universal = require("../Utils/UniversalFunctions");

//*****function to create /add new shop*********//
let createShop = payloadData => {
  //console.log('===inside controller',payloadData)
  return new Promise(async (resolve, reject) => {
    try {
      payloadData["location"] = {
        coordinates: payloadData.coordinates
      };
      let user = await Service.UserService.Insert(payloadData);
      return resolve(user);
    } catch (error) {
      return reject(error);
    }
  });
};
//*****function to get shoplist using location and shop name search*********//
let getShopList = payloadData => {
  return new Promise(async (resolve, reject) => {
    try {
      //get total count of shops for pagination
      
      //create criteria for query obj
      let crit = {};
      //check shop name exists
      if (payloadData.shopName && payloadData.shopName !== "") {
       
        let regex = new RegExp(payloadData.shopName, "i");
        crit = { shopName: regex };
      
      }
      // lat:Joi.number(),
      // long:Joi.number(),
      //check coordinates exists
      if (
        payloadData.long &&  payloadData.long !=="" &&
        payloadData.lat  && payloadData.lat !== ""
       
      ) {
        crit = {
          location: {
            $near: {
              $geometry: {
                type: "Point",
                coordinates: [payloadData.long,payloadData.lat]
              },
              $maxDistance: 5000
            }
          }
        };
      }
      //get list of shops
      console.log("===============",crit)
      let Count = await Service.UserService.Find(crit);
      let user = await Service.UserService.Find(
        crit,
        { __v: 0 },
        { sort:{shopName:1},skip: payloadData.skip, limit: payloadData.limit }
      );
      return resolve({ totalCount:Count.length, list: user });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  createShop: createShop,
  getShopList: getShopList
};
