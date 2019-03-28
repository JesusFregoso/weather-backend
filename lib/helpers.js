/*
 * Helpers for various tasks
 *
 */

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    console.log(e);
    return {};
  }
};

const mysql = require('mysql');

helpers.con = mysql.createConnection({
  host: "0.0.0.0",
  user: "root",
  password: "123",
  port: 8083,
  database: 'weather'
});

helpers.con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});
// Export the module
module.exports = helpers;
