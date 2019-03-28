/*
 * Request Handlers
 *
 */

// Dependencies
var helpers = require('./helpers');

// Define all the handlers
var handlers = {};

// Ping
handlers.ping = function(data,callback){
    callback(200);
};

// Not-Found
handlers.notFound = function(data,callback){
  callback(404);
};

// Cities
handlers.cities = function(data,callback){
  var acceptableMethods = ['post','get'];
  if(acceptableMethods.indexOf(data.method) > -1){
    handlers._cities[data.method](data,callback);
  } else {
    callback(405);
  }
};

// Container for all the users methods
handlers._cities  = {};

// Users - post
// Required data: firstName, lastName, phone, password, tosAgreement
// Optional data: none
handlers._cities.post = function(data,callback){
  console.log(data);
  // Check that all required fields are filled out
  var cityName = typeof(data.payload.cityName) == 'string' && data.payload.cityName.trim().length > 0 ? data.payload.cityName.trim() : false;
  var longitud = typeof(data.payload.longitud) == 'string' && data.payload.longitud.trim().length > 0 ? data.payload.longitud.trim() : false;
  var latitud = typeof(data.payload.latitud) == 'string' && data.payload.latitud.trim().length == 10 ? data.payload.latitud.trim() : false;
  
  console.log(data);
  if(cityName && longitud && latitud ){
    // Make sure the user doesnt already exist
    let sql = 'SELECT * FROM cities WHERE name LIKE '+ cityName;

    helpers.con.query(sql, function (err, result) {
      if (err) {
        callback(400,{error: 'error in database'})
      };
      if (result.length){
        callback(400,{error: 'A city with this name already exists'})
      }
      sql = `INSERT INTO cities(name,longitud,latitud) VALUES (${cityName},${longitud},${latitud})`
      helpers.con.query(sql, function (err, result) {
        if (err) {
          callback(400,{error: 'error in database'})
        };
        callback(200,result)
      });
    });

  } else {
    callback(400,{'Error' : 'Missing required fields'});
  }

};

// Required data: none
// Optional data: none
// @TODO let user to get all the cities in database.
handlers._cities.get = function(data,callback){
  var isDefault = typeof(data.queryStringObject.default) == 'string' && data.queryStringObject.default == 'true' ? true : false;
  // get the all cities
  let sql = `SELECT * FROM cities`;

  if (isDefault) {
    sql += " WHERE name LIKE 'Obregon'" ;
  }

  helpers.con.query(sql, function (err, result) {
    if (err) {
      callback(400,{error: 'error in database'})
    };
    callback(200,result);
  });
};

// Export the handlers
module.exports = handlers;
