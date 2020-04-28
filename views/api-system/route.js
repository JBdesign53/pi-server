/*

URL:      /api/system/[lowercase System Information module function names]
Method:   GET

https://systeminformation.io/

*/

const path = require('path');
const si = require('systeminformation');

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

console.log('SI', siFuncObj);


module.exports = function(app){
  var route = '/api/sys/' + '(' + siRoutes + ')';

  console.log(route);

  async function submitQuery(req, res, next){
    var path = req.originalUrl;
    var pathArr = path.split('/');
    var key = pathArr[pathArr.length - 1]; 
    var siFunc = siFuncObj[key];

    //sendResponse(si.time());

    siFunc()
      .then(data => sendResponse(data))
      .catch(error => console.error(error));

    function sendResponse(json){
      res.set('Content-Type', 'application/json');
      res.send(json);
      next();
    }
  }

  app.get(route, submitQuery);
  app.post(route, submitQuery);
}