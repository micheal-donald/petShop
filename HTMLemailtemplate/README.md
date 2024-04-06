This application serves as a basic starting point for sending HTML emails using Express and Handlebars.

Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (version 12 or higher recommended)
npm (usually comes with Node.js)
Git
Getting Started
Follow these steps to get the application running on your local machine:

1. Clone the Repository
First, clone the repository to your local machine using Git:

bash
Copy code
git clone https://github.com/yourusername/htmlemailtemplate.git
cd htmlemailtemplate
Replace https://github.com/yourusername/htmlemailtemplate.git with the actual URL of your repository.

2. Install Dependencies
Next, install the project's dependencies using npm:

bash
Copy code
npm install
This command reads the package.json file and installs all the necessary dependencies listed under dependencies.

3. Set Up Environment Variables
Create a .env file in the root of your project to store your environment variables. For example:

env
Copy code
ADMIN_EMAIL=youradminemail@example.com
ADMIN_PASSWORD=youradminpassword
Make sure to replace youradminemail@example.com and youradminpassword with your actual admin email and password.

4. Start the Application
Run the application using npm:

bash
Copy code
npm start
If your package.json does not have a start script, you can start the application directly with node:

bash
Copy code
node index.js
5. Accessing the Application
Once the application is running, you can access it by navigating to http://localhost:8080 in your web browser.