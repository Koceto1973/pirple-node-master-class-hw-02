// Helpers for various tasks

// Dependencies
var config = require('./config');
var crypto = require('crypto');
var querystring = require('querystring');

// Container for all the helpers
var helpers = {};

// Parse a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str);
    return obj;
  } catch(e){
    return {};
  }
};

// Create a SHA256 hash
helpers.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
};

// Create a string of random alphanumeric characters, of a given length
helpers.createRandomString = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    // Start the final string
    var str = '';
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
        // Append this character to the string
        str+=randomCharacter;
    }
    // Return the final string
    return str;
  } else {
    return false;
  }
};

// verify pizza order
// at least one
// max five per model
// max twenty total
helpers.verifyOrder = function(order){
  let count = 0;
  let acceptable = true;
  Array.prototype.forEach.call(order, (item)=>{
    if( item<0 || item>5 ) { acceptable = false; }
    count +=item;
  });

  // at least one and max twenty
  if( count>0 && count<21 && acceptable) {
    return true;
  } else {
    return false;
  }  
}

helpers.createStripePayment = function(token,amount,calback){
  
  var requestOptions = {
    protocol:'https:',
    hostname: 'api.stripe.com',
    path: '/v1/charges',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${config.authTokenStripe}`,
    },
  };

  // instantiate the request, the success listener
  var request = https.request(requestOptions, function(response){
    callback(200,response.id);
  });

  // bind error listener
  request.on('error', function(err){
    callback(err,{'Error':'Failed to complete the Stripe test charge'});
  });

  // bind timeout listener
  request.on('timeout', function(err){
    callback(err,{'Timeout':'Failed to complete the Stripe test charge'});
  });

  var requestQueries = {
    source: token,
    amount: amount,
    currency: 'usd',
    description: 'Test Charge',
  };

  // write the query string
  request.write(querystring.stringify(requestQueries));

  // make the request
  request.end();
};

// Export the module
module.exports = helpers;