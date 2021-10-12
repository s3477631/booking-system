import * as sst from '@serverless-stack/resources';
import * as apigAuthorizers from '@aws-cdk/aws-apigatewayv2-authorizers';
import * as cognito from '@aws-cdk/aws-cognito';

export class CreateApiStack {
    public createApi(stack: sst.Stack, table: sst.Table, userPool: cognito.UserPool, userPoolClient: cognito.UserPoolClient): sst.Api {
      return  new sst.Api(stack, 'Api', {
            defaultAuthorizer: new apigAuthorizers.HttpUserPoolAuthorizer({
                userPool,
                userPoolClient,
            }),
            defaultAuthorizationType: sst.ApiAuthorizationType.JWT,
            defaultFunctionProps: {
                // Pass in the table name to our API
                environment: {
                    tableName: table.dynamodbTable.tableName,
                },
            },
          // this could be genericised.
            routes: {
                'GET /bookings': {
                    function: 'src/list.main'
                },
                'POST   /bookings': {
                    function: 'src/create.main'
                },
                'GET    /bookings/{bookingId}': 'src/get.main',
                'PUT    /bookings/{bookingId}': 'src/update.main',
                'DELETE /bookings/{bookingId}': 'src/delete.main',
            },
        });
    }
}
