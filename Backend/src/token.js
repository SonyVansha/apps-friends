const crypto = require("crypto");
const moment = require("/opt/node_modules/moment");
const saltedMd5 = require("/opt/node_modules/salted-md5");
const {
   PutItemCommand,
   DynamoDBClient,
} = require("/opt/node_modules/@aws-sdk/client-dynamodb");
const { buildResponse } = require("/opt/utilities");

const config = { region: "us-east-1" };
const client = new DynamoDBClient(config);
const TableName = "users";

module.exports.handler = async (event) => {
   try {
      // body request
      const { userId } = JSON.parse(event.body);
      const token = saltedMd5(moment().unix(), crypto.randomBytes(16));

      // Data Table dynamodb
      const params = {
         TableName,
         Item: {
            token: { S: token },
            userId: { S: userId }
         },
         ConditionExpression: "attribute_not_exists(userId)",
      };

      const command = new PutItemCommand(params);
      await client.send(command);

      // View Body
      const resBody = {
         token,
         userId,
      };

      return buildResponse(200, "Generate token success", resBody);
   } catch (e) {
      console.error("Error generate token : " + e);
      return buildResponse(500, "Generate token error!", e);
   }
};