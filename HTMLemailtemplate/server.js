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


// Axios instance for API requests
const apiClient = axios.create({
    baseURL: 'https://pet-shop.buckhill.com.hr/api/v1',
    headers: {
        'Accept': '*/*',
        'Content-Type': 'application/json'
    }
});

// Function to log in and get a bearer token using axios
async function loginAndGetBearerToken() {
    try {
        const response = await apiClient.post('/user/login', {
            email: process.env.EMAIL, // Use environment variables
            password: process.env.PASSWORD
        });
        return response.data.data.token;
    } catch (error) {
        console.error('Error during login:', error);
        return undefined;
    }
}

  //using the function
  loginAndGetBearerToken()
    .then(token => {
      if (token) {
        console.log('Received Token:', token);
      } else {
        console.log('No token received', token);
      }
    })
    .catch(error => console.error(error));


// Function to fetch data from the API using the bearer token
async function getOrders(bearerToken) {
    try {
        const response = await apiClient.get('/orders', {
            headers: { 'Authorization': `Bearer ${bearerToken}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error during order retrieval:', error);
        return undefined;
    }
}
  
//   (async () => {
//     try {
//       const token = await loginAndGetBearerToken(); // Get the bearer token
//       const orders = await getOrders(token);
//       //console.log(orders); // The retrieved orders data
//       const mostRecentOrder = orders.data[0];
//       //get most recent uid
//         console.log('Most recent order:', mostRecentOrder.uuid);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();
async function getMostRecentOrderUUID() {
    try {
      const token = await loginAndGetBearerToken(); // Get the bearer token
      const orders = await getOrders(token);
  
      const mostRecentOrder = orders.data[0]; // Assuming newest first in 'data' array
  
      if (mostRecentOrder) {
        return mostRecentOrder.uuid; // Return the UUID of the most recent order
      } else {
        console.error("No orders found in the data.");
        return null; // Or throw an error if appropriate
      }
    } catch (error) {
      console.error('Error retrieving most recent order:', error);
      throw error; // Re-throw the error for handling outside the function
    }
  }
  
// Function to fetch data from the API using the bearer token
async function getOrderData(uuid, token) {
    try {
        const response = await fetch(`https://pet-shop.buckhill.com.hr/api/v1/order/${uuid}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching order: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Order data:', data);
        return data;
    } catch (error) {
        console.error(`Error fetching order ${uuid}:`, error.message);
        return null;
    }
}

// Express route handler

app.get('/', async (req, res) => {
    try {
        const token = await loginAndGetBearerToken();
        if (!token) {
            res.status(500).send('Failed to log in or obtain token.');
            return;
        }

        // Use a valid UUID for an order
        //const orderUuid = '3bea3cf0-e41c-3e65-ae7a-a906ae4c0e6b';
        const orderUuid = await getMostRecentOrderUUID();
        const orderData = await getOrderData(orderUuid, token);

        if (!orderData) {
            res.status(500).send(`Failed to retrieve data for order ${orderUuid}.`);
            return;
        }

        // Now you have orderData, which you can pass to your template
        res.render('index', orderData);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred.');
    }
});
