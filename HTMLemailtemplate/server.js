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

// Start the server
app.listen(8080, () => {
    console.log('Server started on port', 8080);
  });

//fetch data from the API
async function getOrderData(uuid) {
    try {
        const response = await axios.get(`https://pet-shop.buckhill.com.hr/api/v1/order/${uuid}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order ${uuid}:`, error.message);
        return null;
    }
}
app.get('/', (req, res) => {

    const data = {
        purchase: {
            customerName: 'John Doe',
            id: '123456',
            amountDue: '150.00'
        },
        checkoutUrl: 'https://example.com/checkout'
    };

    res.render('index', data);
  });
  
