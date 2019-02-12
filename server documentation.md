Hi guys, here is a brief talk how to call the API,
further hints you may gather from:
  - postman requests / environment collections attached for your convinience
  - comments into code, handlers.js and helpers.js
  - and the code itself, handlers.js and helpers.js

I. Users management: CRUD functionality is covered, use /users route
  1. create new user:
    // post request to /users
    // Required payload data: name( valid non-zero string), email( valid string, min 5 chars), address( valid string, min 10 chars), password ( valid non-zero string)
    // Required headers: Content-Type: application/json
    // on success response status code should be 200
  2. get user data: you should have had issued a user token first, see below for token create
    // get request to /users
    // Required querystring data: email( valid string, min 5 chars)
    // Required headers data: valid user token ( api generated )
    // Required headers: Content-Type: application/json
    // Optional data: none
    // on success response status code should be 200, and user details in json ( without password )
  3. amend user data: you should have had issued a user token first, see below for token create
    // put request to /users
    // Required querystring data: email( valid string, min 5 chars)
    // Required headers data: valid user token ( api generated )
    // Required headers: Content-Type: application/json
    // Optional payload data: name( valid non-zero string), address( valid string, min 10 chars), password ( valid non-zero string)       , at least one must be specified to get the request in use
    // on success response status code should be 200
  4. delete user data: you should have had issued a user token first, see below for token create
    // delete request to /users
    // Required querystring data: email( valid string, min 5 chars)
    // Required headers data: valid user token ( api generated )
    // Required headers: Content-Type: application/json
    // on success response status code should be 200, also user's orders are wiped out

II. Tokens management: CRUD functionality is covered, use /tokens route
  1. create new token:
    // post request to /tokens
    // Required payload data: email( valid string, already registered as email in I.1), password ( valid string, already registered as password in I.1)
    // Required headers: Content-Type: application/json
    // on success response status code should be 200, and token details in JSON, token is valid for 1 hour
  2. get user token data: 
    // get request to /tokens
    // Required querystring data: id of the token
    // Optional data: none
    // on success response status code should be 200, and token details in JSON
  3. extend token validity: 
    // put request to /tokens
    // Required payload data: id of the token and extend property set to true
    // Required headers: Content-Type: application/json
    // on success response status code should be 200, and token validity extended for 1 hour more
  4. delete token: 
    // delete request to /tokens
    // Required querystring data: id of the token
    // Optional data: none
    // on success response status code should be 200

III. Orders management: CRUD functionality is covered, use /orders and /menu routes
  0. get the menu:
    // get request to /menu
    // Required headers data: email( valid string, already registered as email in I.1), token ( valid string, issued in II.1)
    // on success response status code should be 200, 
       and menu details in JSON with 17 properties, formatted <pizza model>:<price in usd>
  1. create new order:
    // post request to /orders
    // Required payload data: email( valid string, already registered as email in I.1), 
      order ( valid array of 17( number of pizzas in menu ) integers, representing ordered qtty of each pizza model)
      for example: "order":[ 0,1,3,0,0,0,3,0,0,0,0,2,0,0,0,0,0 ]
      order limitations: order min 1, max 20, max 5 per pizza model
    // Required headers: Content-Type: application/json
    // Required headers: id of a valid user token
    // on success response status code should be 200, and order id details in JSON, status is 'accepted'
  2. get order(s) data: 
    // get request to /orders
    // Required headers data: token, email
    // Optional headers data: order id, to get details of only particular order of many orders
    // on success response status code should be 200, and order(s) details in JSON
  3. amend order details: allowed only once, up to 5 min after order is accepted first 
    // put request to /orders
    // Required payload data: email( valid string, already registered as email in I.1), 
      order ( valid array of 17( number of pizzas in menu ) integers, representing ordered qtty of each pizza model)
      for example: "order":[ 0,1,3,0,0,0,3,0,0,0,0,2,0,0,0,0,0 ]
      order limitations: order min 1, max 20, max 5 per pizza model
    // Required headers: Content-Type: application/json
    // Required headers: id of a valid user token, id of a valid order with status 'accepted'
    // on success response status code should be 200, and order status amended to 'updated'
  4. delete order: 
    // delete request to /orders
    // Required querystring data: id of the order to be deleted, with status 'accepted' or 'updated'
    // Required headers: id of a valid user token, user email
    // on success response status code should be 200
  