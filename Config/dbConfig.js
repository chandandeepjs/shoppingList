'use strict';
const MongoClient = require('mongoose');
const url = 'mongodb://localhost/shoppingList';  

let mongodb = (payloadData) => {
  return new Promise(async (resolve, reject) => {
      try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true })
          console.log('====db connected sucessfully==');
          return resolve(client);
      }
      catch (error) {
          console.log(error, '====db connection Error==');
          return reject(error);
      }
  })
};
mongodb();

