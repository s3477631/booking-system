import AWS from 'aws-sdk';
import * as uuid from 'uuid';
import jwt_decode from 'jwt-decode';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event) {
    const token = event.headers['authorization'];
    const decoded = jwt_decode(token);
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        Item: {
            userId: decoded[`sub`],
            bookingId: uuid.v1(),
            content: data.content,
            createdAt: Date.now()
        }
    };
    await dynamoDb.put(params).promise();
    return {
        statusCode: 201,
        body: JSON.stringify(data),
    };
}
