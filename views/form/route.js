/*

URL:      /form
Method:   GET, POST

*/

module.exports = function(app){

  var dir = 'form';
  var route = '/' + dir;

  console.log(route);

  app.get(route, (req, res) => {
    var context = {
      'title' : 'Basic Website Form'
    }

    res.render(dir + '/view.hbs', context);
  });
  
}