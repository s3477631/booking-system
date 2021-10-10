import * as sst from '@serverless-stack/resources';
import * as iam from '@aws-cdk/aws-iam';
import * as cognito from '@aws-cdk/aws-cognito';
import * as lambda from '@aws-cdk/aws-lambda';
import {PolicyStatement} from '@aws-cdk/aws-iam/lib/policy-statement';

export class CreateCognitoStack {

    public createInitialUserPermissions(table: sst.Table): PolicyStatement {
        return new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['dynamodb:*'],
            resources: [table.tableArn]
        });
    }

    public createUserPool(stack: sst.Stack, initialPermissions, table: sst.Table): cognito.UserPool {
        return new cognito.UserPool(stack, 'UserPool', {
            selfSignUpEnabled: true,
            signInAliases: {email: true},
            signInCaseSensitive: false,
            lambdaTriggers: {
                postConfirmation: new sst.Function(stack, 'ConfirmationTrigger', {
                    handler: 'src/addUserToTable.main',
                    runtime: lambda.Runtime.NODEJS_12_X,
                    retryAttempts: 0,
                    permissions: [initialPermissions],
                    environment: {
                        tableName: table.dynamodbTable.tableName,
                    },
                })
            }
        });
    }

    public createUserPoolClient(stack: sst.Stack, userPool: cognito.UserPool): cognito.UserPoolClient {
        // Create User Pool Client
        return new cognito.UserPoolClient(stack, 'UserPoolClient', {
            userPool,
            authFlows: {userPassword: true},
        });
    }

    public createAuth(stack: sst.Stack, userPool: cognito.UserPool, userPoolClient: cognito.UserPoolClient): sst.Auth {
        return new sst.Auth(stack, 'Auth', {
            cognito: {
                userPool,
                userPoolClient,
            },
        });
    }
}
