// Import required modules
const express = require('express'); // Import Express.js for creating the server
const mongoose = require('mongoose'); // Import Mongoose for MongoDB interactions
const cors = require('cors'); // Import CORS middleware 


// Initialize Express application
const app = express();
const PORT = 5400; 

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Middleware to enable CORS (Cross-Origin Resource Sharing) 
app.use(cors());

// MongoDB connection URL
const MONGO_URL = 'mongodb+srv://amanatsingh872001:amanat@cluster0.lyxfapx.mongodb.net/Todo?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB using Mongoose
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
})
  .then(() => console.log('Connected to MongoDB')) 
  .catch((err) => console.log(err)); 

// Import and set up routes
require('./models/data'); // Import Mongoose model 
app.use(require('./routes/dataroutes')); // Use routes  for handling API requests

// Start the server 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});
