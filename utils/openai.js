const { OpenAI } = require("openai");
const util = require("util");
const openai = new OpenAI({
  api_key: process.env.OPENAI_API_KEY,
});
async function extractCompanyData(text) {
  const messages = [{ role: "user", content: text }];
  const tools = [
    {
      type: "function",
      function: {
        name: "extract_company_data",
        description:
          "Extraction of company data from the Pitchdeck PDF, including category, traction, funds raised, customers, market size, and teamSize, teamName, locatedAt if nothing comes up meaning nothing in companies data or any youtube video or audio or irrelevant infomration ignore it and return null for all the fields in the json ojects. Importantly if the parsed text doesnt contain information and contain other things think youtube video, just images without any text all this time return null only or need human intervention to understand the context of the text for those kind of messages return null for all the pobjects.If the documnent is not realted to pitchdeck or any company, return null for all the fields in the json object. If the data doesnt contain any information about particular company just return null dont process it further return for each and every json field eg.....locatedAt, traction ",
        parameters: {
          type: "object",
          properties: {
            companies: {
              type: "array",
              items: {
                type: "object",
                properties:{
                    name: {
                      type: "string",
                      description: "Name of the company if not present return null"
                    },
                    category: {
                      type: "string",
                      description: "Industry category to which the company belongs, such as Education, Finance, Agriculture. Details like Software Consultancy, Mobile Apps, Blockchain are also relevant and if not present return null."
                    },
                    traction: {
                      type: "string",
                      description: "Current traction the company has gained only consider those points which looks good and have some meaning. mentioned in the pitchdeck don't presume anything if not present return null."
                    },
                    funds_raised: {
                      type: "string",
                      description: "Total funds raised by the company across all funding rounds mentioned in the pitchdeck don't presume anything and merge of all them into single entity like first round funding 2million seed orund 5 million is in pitchdeck output should total value which is 7 million funding if not present return null."
                    },
                    customers: {
                      type: "string",
                      description: "Total number of customers currently using the company's services, apps, or any other offerings mentioned in the pitchdeck here dont mention it seperatly give it as single entity don't presume anything."
                    },
                    market_size: {
                      type: "string",
                      description: "The company's current market size within its industry, such as annual revenue or total addressable market (TAM). Mentioned in the pitchdeck don't presume anything"
                    },
                    team: {
                      type: "string",
                      description: "Total number of team members and their names and there role co-founders and founders."
                    },
                    revenue: {
                      type: "string",
                      description: "Revenue of the compnay mentioned in the pitchdeck total earned sum up everything into single entity, don't presume anything."
                    },
                    locatedAt: {
                      type: "string",
                      description: "company is located at which place like bangaluru, delhi, hyderbad etc... mentioned in the pitchdeck don't presume anything like if they released something in some place doesnt mean they they are located in that place."
                    },
                    summary: {
                      type: "string",
                      description: "A concise summary of the company's pitch deck, the problems they are solving, their novelty, and the total revenue generated to date. Limit to less than 10 lines."
                    }
                  },                  
              },
            },
          },
          required: ["companies"],
        },
      },
    },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo-2024-04-09",
    messages: messages,
    tools: tools,
    tool_choice: "auto",
  });
  console.log(response)
  console.log(util.inspect(response, { showHidden: false, depth: null }));
  const { companies } = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
  const companyData = companies.map((company) => ({
    name: company.name,
    category: company.category,
    traction: company.traction,
    funds_raised: company.funds_raised,
    customers: company.customers,
    market_size: company.market_size,
    team: company.team,
    revenue:company.revenue,
    locatedAt:company.locatedAt,
    summary:company.summary
  }));
  console.log(companyData)
  return companyData;
}

module.exports = extractCompanyData;
