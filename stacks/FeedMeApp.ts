import * as sst from '@serverless-stack/resources';
import {CreateTableStack} from './createTableStack';
import {CreateCognitoStack} from './createCognitoStack';
import {CreateApiStack} from './createApiStack';

export default class FeedMeApp extends sst.Stack {
    constructor(scope: sst.App, id: string, props?: sst.StackProps) {
        super(scope, id, props);

        // initialize stacks;
        const bookingsTable = new CreateTableStack()
        const cognitoConfiguration = new CreateCognitoStack();
        const apiStack = new CreateApiStack();

        // create table
        const table = bookingsTable.createTable(this, 'bookings')
        // initialize permissions for table
        const initialUserPermissions = cognitoConfiguration.createInitialUserPermissions(table)
        // create user pool, userPoolClient and auth
        const userPool = cognitoConfiguration.createUserPool(this, initialUserPermissions, table);
        const userPoolClient = cognitoConfiguration.createUserPoolClient(this, userPool);
        const auth = cognitoConfiguration.createAuth(this, userPool, userPoolClient);

        const api = apiStack.createApi(this, table, userPool, userPoolClient);
        auth.attachPermissionsForAuthUsers([api]);
        api.attachPermissions([initialUserPermissions])

        // outputs to console
        this.addOutputs({
            'ApiEndpoint': api.url,
            'UserPoolId': auth.cognitoUserPool.userPoolId,
            'UserPoolClientId': auth.cognitoUserPoolClient.userPoolClientId,
            'identityPoolId': auth.cognitoCfnIdentityPool.ref,
        });
    }
}
