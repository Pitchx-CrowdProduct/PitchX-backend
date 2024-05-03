const AWS = require("aws-sdk");
const dbConnect = require("./dbConnect");
const logger = require("./logger");
const processFileAsync = require("./processFileAsync");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const sqs = new AWS.SQS();
async function processMessages() {
try {
    await dbConnect();

    const receiveParams = {
      QueueUrl: process.env.AWS_SQS_QUEUE_URL,
      MaxNumberOfMessages: 10,
      VisibilityTimeout: 60,
      WaitTimeSeconds: 20,
    };

    logger.info("Receiving messages from the queue...");
    const data = await sqs.receiveMessage(receiveParams).promise();
    logger.info("Messages received from the queue");

    if (!data.Messages || data.Messages.length === 0) {
      logger.info("No messages in the queue. Waiting...");
      setTimeout(processMessages, process.env.POLL_INTERVAL || 60000);
      return;
    }

    for (const message of data.Messages) {
      const { s3Response, session } = JSON.parse(message.Body);
      await processFileAsync(s3Response, session);

      const deleteParams = {
        QueueUrl: process.env.AWS_SQS_QUEUE_URL,
        ReceiptHandle: message.ReceiptHandle,
      };

      await sqs.deleteMessage(deleteParams).promise();
    }
    processMessages();
  } catch (error) {
    logger.error("Error processing messages:", error);
    setTimeout(processMessages, process.env.POLL_INTERVAL || 60000); 
  }
}

module.exports = processMessages;