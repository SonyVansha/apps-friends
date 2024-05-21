const {
    PutItemCommand,
    UpdateItemCommand,
    GetItemCommand,
    DeleteItemCommand,
    ScanCommand,
 } = require("/opt/node_modules/@aws-sdk/client-dynamodb");
 const { buildResponse } = require("/opt/utilities");
 const { unmarshall } = require("/opt/node_modules/@aws-sdk/util-dynamodb");
 const { client, TableName } = require("./connection");
 
 const getUser = async () => {
     try {
         const params = {
             TableName: TableName
         };
 
         const command = new ScanCommand(params);
         const data = await client.send(command);
         // Mengembalikan data yang ditemukan dari DynamoDB
         const items = data.Items.map(item => unmarshall(item));
         
         // Mengembalikan data yang ditemukan dari DynamoDB
         return buildResponse(200, "Get friend success!", items);
     } catch (e) {
         console.error("Get friend Error: " + e);
         return buildResponse(500, "Get friend Error!", e);
     }
 }
 
 const getUserId = async (id) => {
     try {
         const params = {
             TableName: TableName,
             Key: {
                 nama: { S: id }
             }
         };
 
         const command = new GetItemCommand(params);
         const data = await client.send(command);
 
         if (data.Item) {
             // Mengembalikan data yang ditemukan dari DynamoDB dalam bentuk JSON
             const responseData = [unmarshall(data.Item)];
             return buildResponse(200, "Get friend by id success!", responseData);
         } else {
             return buildResponse(404, JSON.stringify({ error: "friend not found" }));
         }   
         
     } catch (e) {
         console.error("Get friend by id error: " + e);
         return buildResponse(500, "Get friend by id error!", e);
     }
 };
 
 const createUser = async (rawBody) => {
     try {
         const { nama, kelamin, kelas } = rawBody;
         
         // Data Table dynamodb
         const params = {
             TableName,
             Item: {
                 nama: { S: nama },
                 kelamin: { S: kelamin },
                 kelas: { S: kelas }
             },
             ConditionExpression: "attribute_not_exists(nama)",
         };
         const command = new PutItemCommand(params);
         await client.send(command);
 
         // View Body
         const resBody = {
             nama,
             kelamin,
             kelas, 
         };
 
         return buildResponse(200, "Friend is saved", resBody);
     } catch (e) {
       console.error("Create friend error : " + e);
       return buildResponse(500, "Create friend error!", e);
     }
 };
 
 const updateUser = async (rawBody) => {
     try {
         const { nama, kelamin, kelas } = rawBody;
         
         // Check Data Key
         const getItemParams = {
             TableName: TableName,
             Key: {
                 'nama': { S: nama }
             }
         };
 
         const getItemCommand = new GetItemCommand(getItemParams);
         const { Item } = await client.send(getItemCommand);
 
         if (!Item) {
             return buildResponse(404, "Friend not found!");
         }
         
         // Membuat parameter untuk perintah UpdateItem
         const params = {
             TableName: TableName,
             Key: {
                 'nama': { S: nama }
             },
             UpdateExpression: 'set #k = :kelamin, #c = :kelas',
             ExpressionAttributeNames: {
                 '#k': 'kelamin',
                 '#c': 'kelas'
             },
             ExpressionAttributeValues: {
                 ':kelamin': { S: kelamin },
                 ':kelas': { S: kelas }
             },
             ReturnValues: 'ALL_NEW'
         };
        // Kirim perintah UpdateItem ke DynamoDB
         const command = new UpdateItemCommand(params);
         await client.send(command);
 
         return buildResponse(200, "Update friend success!");
     } catch (error) {
         console.error(`Update event error : ${error}`);
         return buildResponse(500, "Update friend error!", null);
     }
 };
 
 const removeUser = async (id) => {
     try {
         const params = {
             TableName: TableName,
             Key: {
                 nama: { S: id }
             }
         };
         
         const command = new DeleteItemCommand(params);
         await client.send(command);
         
         return buildResponse(200, "Remove friend success!");
     } catch (error) {
         console.error(`Remove friend error : ${error}`);
         return buildResponse(500, "Remove friend error!", null);
     }
 };
 
 module.exports = { getUser, getUserId, createUser, updateUser, removeUser };