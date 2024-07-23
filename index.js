
const express = require("express");
const morgan = require("morgan");
const cors=require('cors');
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const processMessages = require("./utils/SqsConsumer");
const extractTextFromPdf = require("./utils/textParser");
const payment = require('./routes/paymentRoutes');
const port = process.env.PORT || 8000; 
const { auth } = require('express-oauth2-jwt-bearer');
const jwt = require('jsonwebtoken');


processMessages();
app.use(morgan('dev'));
// app.use(auth(config));
app.use(cors());
app.get('/', (req, res) => {
  res.send('Hello World!');
});
app.use(bodyParser.json());


app.post('/extract-text', async (req, res) => {
  if (!req.body.url) {
      return res.status(400).send({ error: 'URL parameter is required' });
  }
  
  try {
      const text = await extractTextFromPdf(req.body.url);
      console.log('Text extracted from PDF:', text.slice(0,10));
      res.send({ text });
  } catch (error) {
      console.error('Failed to extract text from PDF:', error);
      res.status(500).send({ error: 'Failed to process the PDF' });
  }
});

app.use('/api', payment);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


