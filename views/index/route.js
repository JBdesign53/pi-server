/*

URL:      /.route-and-view
Method:   GET, POST

*/

module.exports = function(app){

  var dir = 'index';
  var route = '/';

  console.log(route);

  app.get(route, (req, res) => {
    var context = {
      'title' : 'Basic Website',
      'h1' : 'Basic Website'
    }

    res.render(dir + '/view.hbs', context);
  });

}