
const axios = require("axios");
const extractTextFromPdf = require("./textParser");
const processTextWithOpenAI = require("./openai");
const User = require("../models/User");
const logger = require("./logger");

async function processFileAsync(s3Response, session) {
    console.log("Processing file asynchronously");
    console.log("S3 Response:", s3Response);
    console.log("Session:", session);
    try {
      const [extractedText, sourceIdResponse] = await Promise.all([
        extractTextFromPdf(s3Response.Location),
        fetchSourceId(s3Response.Location),
      ]);
  
      const sourceId = sourceIdResponse.sourceId;
      logger.info(`Source ID: ${sourceId}`);
      logger.info(`Extracted Text: ${extractedText}`);
  
      const openAIResponse = await processTextWithOpenAI(extractedText);
      logger.info(`OpenAI Response: ${JSON.stringify(openAIResponse)}`);
      const teamMembers = openAIResponse[0].team.split(', ');
      let teamSize = teamMembers.length;
      if (openAIResponse[0].team.trim() === "") {
          numNames = 0;
      }
      
      const companyDetails = {
        name: openAIResponse[0].name,
        category: openAIResponse[0].category,
        traction: openAIResponse[0].traction,
        fundsRaised: openAIResponse[0].funds_raised,
        customers: openAIResponse[0].customers,
        marketSize: openAIResponse[0].market_size,
        team: openAIResponse[0].team,
        teamSize:teamSize,
        locatedAt: openAIResponse[0].locatedAt,
        revenue: openAIResponse[0].revenue,
        summary: openAIResponse[0].summary,
      };
      const existingFile = await User.findOne({
        auth0Id: session.user.sub,
        'files.fileName': s3Response.Key
      });

      if(!existingFile) {
      await User.findOneAndUpdate(
        { auth0Id: session.user.sub },
        {
          $push: {
            files: {
              fileName: s3Response.Key,
              s3Key: s3Response.Key,
              s3Url: s3Response.Location,
              uploadDate: new Date(),
              sourceId: sourceId,
              ...companyDetails,
            },
          },
          $setOnInsert: { email: session.user.email },
        },
        { upsert: true, new: true }
      );
    }
      logger.info("User updated with file details asynchronously");
    } catch (error) {
      logger.error("Error in async processing", error);
      throw error;
    }
  }
  
  async function fetchSourceId(s3ResponseLocation) {
    const config = {
      headers: {
        "x-api-key": process.env.API_KEY,
        "Content-Type": "application/json",
      },
    };
    const data = { url: s3ResponseLocation };
  
    try {
      const response = await axios.post(
        "https://api.chatpdf.com/v1/sources/add-url",
        data,
        config
      );
      logger.info(`Source ID Response: ${JSON.stringify(response.data)}`);
  
      if (!response.data.sourceId) {
        throw new Error("Failed to fetch source ID");
      }
  
      return response.data;
    } catch (error) {
      logger.error("Error fetching source ID:", error);
      throw error;
    }
  }

module.exports = processFileAsync;