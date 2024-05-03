
const express = require("express");
const app = express();
const processMessages = require("./utils/SqsConsumer");

require("dotenv").config();
const port = process.env.PORT || 3000; // Default port is 3000

// Start processing messages
processMessages();

// Listen for incoming connections
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


