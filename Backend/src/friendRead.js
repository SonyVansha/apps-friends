const { buildResponse } = require("/opt/utilities");
const { getUser, getUserId } = require("./lib/tool");

module.exports.handler = async (event) => {
  try {
      const httpMethod = event?.httpMethod;
      const pathRequest = event?.resource;

      if (httpMethod == "GET" && pathRequest == "/friend") {
        return await getUser();
      } else if (httpMethod == "GET" && pathRequest == "/friend/{id}") {
         const userId = event.pathParameters.id;
         return await getUserId(userId);
      } else {
        return buildResponse(400, "BAD REQUEST!", null);
      }
  } catch (e) {
      console.error(`Got error while read Product : ${e}`);
      return buildResponse(500, "Internal Server Error d", null);
  }
};