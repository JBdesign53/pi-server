/*

URL:      /api/system/[lowercase System Information module function names]
Method:   GET

https://systeminformation.io/


TODO:

Most function calls do net require parameters (except a callback).
Some function calls require 1 or more parameters. These can be set as a query string in the form:
/api/sys/inetchecksite&google.com.au

Most functions from SI return JSON.
Some functions return text. These will be converted to JSON.

https://stackoverflow.com/questions/3914557/passing-arguments-forward-to-another-javascript-function

*/

const path = require('path');
const si = require('systeminformation');

// Expose all the functions in systeminformation() as API endpoints.
// Match each endpoint URL to a systeminformation() function.
var siFuncObj = [];
var routeArr = [];
var name, siRoutes;

for(name in si){
  if(typeof si[name] == 'function'){
    routeArr.push(name.toLowerCase());
    siFuncObj[name.toLowerCase()] = si[name];
  }
}

siRoutes = '|';
siRoutes += routeArr.join('|');

// console.log('SI', siFuncObj);


module.exports = function(app){
  var route = '/api/sys/' + '(' + siRoutes + ')';

  console.log(route);

  async function submitQuery(req, res, next){
    // We want the 'function' name part of the page eg.
    // cpu from /api/sys/cpu?blah#ldskl
    var url = req.originalUrl;

    // Remove query string and URL fragment.
    var arr = url.split('?');
    url = arr[0];
    arr = url.split('#');
    url = arr[0];
    
    // Get SI function being reqested in the url.
    // Note there is a leading / in the url.
    url = url.split('/')[3];

    // Match the URL to the SI function.
    var siFunc = siFuncObj[url];

    // Check how many parameters the function expects.
    // Exclude the last parameter as it's the callback.
    var siFuncParams = siFunc.length - 1;
    
    var qsParams = 0;
    for(name in req.query){
      qsParams++;
    }

    console.log('SI args', siFuncParams);
    console.log('QS args', qsParams);

    if(qsParams >= siFuncParams){
      var argsArr = [];

      for(name in req.query){
        argsArr.push(name);
      }

      console.log('QS Args', argsArr);

      /*
      Function can have:
        0 arguments
        1+ arguments
      */

      // siFunc(argsArr)
      siFunc()
        .then(data => sendResponse(data))
        .catch(error => console.error(error));
    }else{
      sendResponse({'error':'Incorrect number of arguments. Expected ' + siFuncParams + '.'});
    }

    //sendResponse(si.time());

    function sendResponse(json){
      res.set('Content-Type', 'application/json');
      res.send(json);
      next();
    }
  }

  app.get(route, submitQuery);
  app.post(route, submitQuery);
}