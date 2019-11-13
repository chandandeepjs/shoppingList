'use strict';
const Service = require('../Services');
const Config = require('../Config');
const moment = require("moment");
let md5 = require('md5');
let path = require('path');
let fs = require('fs');
let Universal = require('../Utils/UniversalFunctions'); 

let createShop = (payloadData) => {console.log('===inside controller',payloadData)
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

let getShopList = (payloadData) => {console.log('===inside controller',payloadData)
  return new Promise(async (resolve, reject) => {
    try {
       let Count = await Service.UserService.Count({})
       let user = await Service.UserService.Find({},{'__v':0},{skip:payloadData.skip,limit:payloadData.limit})

       return resolve({totalCount:Count,list:user})
    } catch (error) {
      return reject(error)
    }
  });
}

let searchShops = (payloadData) => {console.log('===inside controller',payloadData)
  return new Promise(async (resolve, reject) => {
    try {
      let crit={}
      if(payloadData.shopName && payloadData.shopName !=="" && (!payloadData.coordinates||payloadData.coordinates.length==0)){
        console.log("=========1111")
        //$text: { $search: "java coffee shop" } 
        crit={$text: { $search:payloadData.shopName}
      }
    }
      if(payloadData.coordinates && payloadData.coordinates.length!==0 && (!payloadData.shopName||payloadData.shopName=="")){
        console.log("=========22222")
        crit={
          location:
              { $near :
                 {
                   $geometry: { type: "Point",  coordinates:payloadData.coordinates },
                   $minDistance: 1000,
                   $maxDistance: 5000
                 }
              }}
      }
      // if(payloadData.coordinates && payloadData.shopName &&  payloadData.shopName !=="" && payloadData.coordinates.length!==0){
      //   console.log("=========33333")
      //   crit={
      //     location:
      //         { $near :
      //            {
      //              $geometry: { type: "Point",  coordinates:payloadData.coordinates },
      //              $minDistance: 1000,
      //              $maxDistance: 5000
      //            }
      //         }}
      // }
      //}
    
       let user = await Service.UserService.Find(crit,{'__v':0},{skip:payloadData.skip,limit:payloadData.limit})
       return resolve(user)
    } catch (error) {
      return reject(error)
    }
  });
}
module.exports = {
  createShop: createShop,
  getShopList:getShopList,
  searchShops:searchShops
 
};