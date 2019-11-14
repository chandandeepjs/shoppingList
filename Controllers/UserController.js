'use strict';
const Service = require('../Services');
const Config = require('../Config');
const moment = require("moment");
let md5 = require('md5');
let path = require('path');
let fs = require('fs');
let Universal = require('../Utils/UniversalFunctions'); 

let createShop = (payloadData) => {//console.log('===inside controller',payloadData)
  return new Promise(async (resolve, reject) => {
    try {
      payloadData["location"]={
        "coordinates":payloadData.coordinates
      }
       let user = await Service.UserService.Insert(payloadData)
       return resolve(user)
    } catch (error) {
      return reject(error)
    }
  });
}

let getShopList = (payloadData) => {
  return new Promise(async (resolve, reject) => {
    try {
      let Count = await Service.UserService.Count({})
      let crit={}
      if(payloadData.shopName && payloadData.shopName !==""){
        
        let regex = new RegExp(payloadData.shopName, "i");
        crit={shopName:regex}
      }
      if(payloadData.coordinates && payloadData.coordinates.length!==0 && payloadData.coordinates!==undefined){ 
        crit={
        location: { $near :
           {
             $geometry: { type: "Point",coordinates:payloadData.coordinates },
             $maxDistance: 5000
           }
        } } 
    }
       let user = await Service.UserService.Find(crit,{'__v':0},{skip:payloadData.skip,limit:payloadData.limit})

       return resolve({totalCount:Count,list:user})
    } catch (error) {
      return reject(error)
    }
  });
}


module.exports = {
  createShop: createShop,
  getShopList:getShopList
};