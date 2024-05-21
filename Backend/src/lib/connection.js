const { DynamoDBClient } = require("/opt/node_modules/@aws-sdk/client-dynamodb");

const config = { region: "us-east-1" };
const client = new DynamoDBClient(config);

const TableName = "dataTeman";

module.exports = { client, TableName }