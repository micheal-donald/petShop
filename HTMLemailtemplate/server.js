require('dotenv').config();
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
async function loginAndGetBearerToken(_url,_email,_password) {
    try {
        const response = await apiClient.post(_url, {
            email:_email,//process.env.EMAIL, // Use environment variables
            password:_password //process.env.PASSWORD
        });
        return response.data.data.token;
    } catch (error) {
        console.error('Error during login:', error);
        return undefined;
    }
}

  //using the function to log into admin
  loginAndGetBearerToken('/admin/login',process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD)
    .then(token => {
      if (token) {
        console.log('Received Admin Token');
      } else {
        console.log('No token Admin received');
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
//       const randomOrder  = orders.data[0];
//       //get most recent uid
//         console.log('Most recent order:', randomOrder .uuid);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   })();
async function getRandomOrderUUID() {
        try {
            const token = await loginAndGetBearerToken('/admin/login', process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD); // Get the bearer token
            const orders = await getOrders(token);

            // Filter orders to only those with "payment": null
            const ordersWithNoPayment = orders.data.filter(order => order.payment === null);
            //console.log(ordersWithNoPayment.length)
            //Filter orders with pending payment
            const ordersWithPendingPayment = orders.data.filter(order => order.order_status.title === 'pending');
            //console.log(ordersWithNoPayment.length)
            
            if (ordersWithNoPayment.length > 0) {
            // To get a random order UUID, ensure there's at least one order
            const randomIndex = Math.floor(Math.random() * ordersWithNoPayment.length);
            //console.log(orders.length)
            const randomOrder  = ordersWithNoPayment[randomIndex];
    
            if (randomOrder ) {
            return randomOrder .uuid; // Return the UUID of the most recent order
            } else {
            console.error("No orders found in the data.");
            return null; // Or throw an error if appropriate
            }
            }
            
        } catch (error) {
            console.error('Error retrieving order UUID:', error);
            throw error; // Re-throw the error for handling outside the function
        }
        
}
  
// Function to fetch data from the API using the bearer token
async function getOrderData(uuid, token) {
    try {
        const response = await axios.get(`https://pet-shop.buckhill.com.hr/api/v1/order/${uuid}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Order data:', response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching order ${uuid}:`, error);
        return null;
    }
}

// Express route handler

app.get('/', async (req, res) => {
    try {
        const token = await loginAndGetBearerToken('/admin/login',process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD);
        if (!token) {
            res.status(500).send('Failed to log in or obtain token.');
            return;
        }

        // Use a valid UUID for an order
        //const orderUuid = '3bea3cf0-e41c-3e65-ae7a-a906ae4c0e6b';
        const orderUuid = await getRandomOrderUUID();
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
