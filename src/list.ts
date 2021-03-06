import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
    const params = {
        // Get the table name from the environment variable
        TableName: process.env.tableName,
        // Get all the rows where the userId is our hardcoded user id
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.authorizer.jwt.claims.sub,
        },
    };
    const results = await dynamoDb.query(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(results.Items),
    };
}
