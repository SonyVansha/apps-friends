# Friends System Data

## Backend - API Setup
The root folder for backend projects is **backend**.

#### Lambda Setup
All dependencies required by each Lambda function are located in the **backend/layer** folder and are bundled into a **layer** with name **lks-layer**, dont forget to attach the layer into lambda function.

| Name | Code Source | Description  |
|--|--|--|
| **lks-token** | src/token.js | This function is used to generate token and userId. It uses a maximum of 128MB of memory and has a maximum execution time of 5 seconds. |
| **lks-read-friends** | src/lib, src/friendRead.js | This function is used to display friends data from the database dynamodb. It uses a maximum of 128MB of memory and has a maximum execution time of 5 seconds.|
| **lks-write-friends** | src/lib, src/friendWrite.js | This function is used to save, update and delete friends data to the database dynamodb. It uses a maximum of 256MB of memory and has a maximum execution time of 5 seconds. |

#### API Endpoint

You can check the API endpoint documentation in [here](httpds)