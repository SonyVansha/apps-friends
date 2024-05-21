const { buildResponse } = require("/opt/utilities");
const { createUser, updateUser, removeUser } = require("./lib/controllers");

module.exports.handler = async (event) => {
  try {
    const httpMethod = event?.httpMethod;
    const pathRequest = event?.path?.split("/")[1];

    // Validation path
    if (pathRequest != "friend") {
      return buildResponse(400, "Bad Request!", null);
    }

    // This Method
    switch (httpMethod) {
      case "POST":
        const body = JSON.parse(event.body);
        return await createUser(body);
      case "PUT":
        const updateData = JSON.parse(event.body);
        return await updateUser(updateData);
      case "DELETE":
          const eventId = event?.pathParameters?.id;
          return await removeUser(eventId);
      default:
        return buildResponse(400, "Bad Request!", null);
      }
    } catch (e) {
      console.error(`Got error while writing user : ${e}`);
      return buildResponse(500, "Internal Server Error", null);
    }
};