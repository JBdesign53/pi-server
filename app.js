/*

Basic Website

*/

const path = require('path');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const exphbs = require('express-handlebars');

const http = require('http').Server(app);

const port = 80;


const si = require('systeminformation');


// Body-parser middleware eg. for POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'limit': '100mb', 'extended': 'true' }));


// Public directory
app.use('/', express.static( path.resolve('./public') ));


// Handlebars setup
app.engine('.hbs', exphbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', '.hbs');


// Console information
console.log();
console.log('Web pages may be accessible at http://localhost, IP address or domain name depending on your environment.');
console.log();
console.log('Page paths:');


// Routes and views
require('./views/index/route.js')(app);
require('./views/form/route.js')(app);

// The form will be submitted using AJAX.
require('./views/api-form/route.js')(app);
require('./views/api-system/route.js')(app);


// Start the Express server
var server = http.listen(port, function(){
  console.log();
  console.log('Express server has started on port:', port);
  console.log();
});


// Handle promise exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.log();
  console.error('UNHANDLED PROMISE REJECTION:');
  console.error('Reason:', reason);
  console.error('Stack', reason.stack);
});