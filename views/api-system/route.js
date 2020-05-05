/*

URL:      /api/system/[lowercase System Information module function name]?[optional arguments]
Method:   GET


# System Information HTTP API

Creates a web accessible HTTP API which exposes data from the System Information (SI) NPM module.


## Using the API

An API url takes the form `/api/system/sifuncname` where `sifuncname` is the SI function name in lowercase. For example to see the SI value for `cpuFlags(cb)` you would use the path `/api/system/cpuflags`.

Note: When referring to the System Information documentation the callback `cb` argument should be ignored. Do not pass a value for it when using the API.

If an SI function requires additional arguments (ie. ignore using the cb argument), these should be appended to the API url as a query string. For example the SI function `inetChecksite('google.com', cb)` would be accessed through the API at `/api/system//inetchecksite?google.com`.

With query strings, only the parameter key is used and any value is ignored.

Please see the additional example API urls below. Visit https://systeminformation.io/ for a full list of System Information functions.


## Example API Calls

In the examples below, the number of arguments expected by an SI function are appended to the query string. The query string is the portion of the URL after the '?'.

Keep in mind the callback argument is ignored and not counted.

SI function              SI API url                                 Expected query string parameters
cpu(cb)                  /api/system/cpu                            0
cpuFlags(cb)             /api/system/cpuflags                       0
inetChecksite(url, cb)   /api/system/inetchecksite?apple.com.au     1



## Argument Errors

If you don't pass the required number of arguments you will receive an error. This is an example of not passing the required number of arguments in the query string:

```
{"error":	"Not enough parameters. Expected 1 but got 0."}
```


## API Return Values

Most functions from SI return data in JSON format, however some functions return a string value. When making requests through the API all strings are converted to JSON with the key named `data` eg. `{'data' : 'string value'}`

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

module.exports = function(app){
  var route = '/api/system/' + '(' + siRoutes + ')';

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

    if(qsParams == siFuncParams){
      var i;
      var argsArr = [];

      for(name in req.query){
        argsArr.push(name);
      }

      siFunc(...argsArr)
        .then(data => sendResponse(data))
        .catch(error => console.error(error));
    }else{
      if(qsParams < siFuncParams){
        sendResponse({'error': `Not enough parameters. Expected ${siFuncParams} but got ${qsParams}.`});
      }else{
        sendResponse({'error': `Too many parameters. Expected ${siFuncParams} but got ${qsParams}.`});
      }
    }

    function sendResponse(data){
      var json = data;

      if(typeof data !== 'object'){
        json = {'data': data};
      }

      res.set('Content-Type', 'application/json');
      res.send(json);
      next();
    }
  }

  app.get(route, submitQuery);
  app.post(route, submitQuery);
}