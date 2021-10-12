import AWS from "aws-sdk";
import jwt_decode from 'jwt-decode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
    const token = event.headers['authorization'];
    const decoded = jwt_decode(token);
    console.log(event);
    const params = {
        // Get the table name from the environment variable
        TableName: process.env.tableName,
        // Get the row where the noteId is the one in the path
        Key: {
            userId: decoded[`sub`],
            bookingId: event.pathParameters.id,
        },
    };
    await dynamoDb.delete(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify({ status: true }),
    };
}
