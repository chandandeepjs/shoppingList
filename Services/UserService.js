"use strict";
const Config = require("../Config");
const Model = require("../models");
const Universal = require("../Utils/UniversalFunctions");

//function to save data
let Insert = payloadData => {
  console.log("====payloadData====", payloadData);
  return new Promise(async (resolve, reject) => {
    try {
      let query = await Model.USER(payloadData).save();
      return resolve(query);
    } catch (error) {
      // console.log('==insertUser======', error);
      return reject(error);
    }
  });
};
//function to update data
let Update = (crit, dataToSet, options) => {
  //console.log(crit,"======",dataToSet,"====tt",options)
  return new Promise(async (resolve, reject) => {
    try {
      let query = await Model.USER.findOneAndUpdate(crit, dataToSet, options);
      return resolve(query);
    } catch (error) {
      //console.log('==updateUser======', error);
      return reject(error);
    }
  });
};
//function to find data
let Find = (crit, proj, options) => {
  //console.log("======================",crit,proj,options)
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Model.USER.find(crit, proj, options);
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });
};
//function to get count of records
let Count = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Model.USER.count();
      return resolve(result);
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = {
  Insert: Insert,
  Update: Update,
  Find: Find,
  Count: Count
};
