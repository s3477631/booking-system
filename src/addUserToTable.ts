import AWS from "aws-sdk";
import * as uuid from "uuid";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
    const user = event
    if(user) {
        const params = {
            // Get the table name from the environment variable
            TableName: process.env.tableName,
            Item: {
                userId: user.request.userAttributes.sub,
                bookingId: uuid.v1(), // A unique uuid
                content: 'data.content', // Parsed from request body
                createdAt: Date.now(),
            },
        };
        await dynamoDb.put(params).promise();
        return event
    } else {
        return
    }
}
