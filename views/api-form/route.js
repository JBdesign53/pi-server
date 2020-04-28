/*

URL:      /api/form-submit
Method:   GET, POST

*/

const path = require('path');

module.exports = function(app){
  var route = '/api/form-submit';

  console.log(route);

  async function submitQuery(req, res, next){
    var txt = '';
    var method = 'get';

    if(req.method == "GET"){
      txt = req.query.txt;
    }else{
      txt = req.body.txt;
      method = 'post';
    }

    if(txt){
      sendResponse({'status':1, 'message':'Success', 'txt':txt, 'lenght':txt.length, 'method':method});
    }else{
      sendResponse({'status':0, 'message':'Error: No text was provided.'});
    }

    function sendResponse(json){
      res.set('Content-Type', 'application/json');
      res.send(json);
      next();
    }
  }

  app.get(route, submitQuery);
  app.post(route, submitQuery);
}