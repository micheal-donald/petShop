const express = require('express');
const app = express();
const axios = require('axios');

// Require express-handlebars
const { engine } = require('express-handlebars');

// Set up the handlebars engine
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');

// Serve static files
app.use(express.static('public'));
 
// Define a route for the root of the site
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(8080, () => {
  console.log('Server started on port', 8080);
});
