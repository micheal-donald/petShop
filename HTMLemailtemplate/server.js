//intialise an express server
const express = require('express');
const app = express();

//require handlebars
const handlebars = require('express-handlebars');

app.listen(8080, () => {
  console.log('server started', 8080);
});
