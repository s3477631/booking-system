import AWS from "aws-sdk";
import jwt_decode from 'jwt-decode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
    const token = event.headers['authorization'];
    const decoded = jwt_decode(token);
    const data = JSON.parse(event.body);
    console.log(event.pathParameters)
    const params = {
        // Get the table name from the environment variable
        TableName: process.env.tableName,
        // Get the row where the noteId is the one in the path
        Key: {
            userId: decoded[`sub`],
            bookingId: event.pathParameters.id,
        },
        // Update the "content" column with the one passed in
        UpdateExpression: "SET content = :content",
        ExpressionAttributeValues: {
            ":content": data.content
        },
        ReturnValues: "ALL_NEW",
    };

    const results = await dynamoDb.update(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(results.Attributes),
    };
}
