import * as sst from '@serverless-stack/resources';

export class CreateTableStack {
    public createTable(stack: sst.Stack, tableName: string): sst.Table {
        // Create the table
        return new sst.Table(stack, tableName, {
            fields: {
                userId: sst.TableFieldType.STRING,
            },
            primaryIndex: {partitionKey: 'userId'},
        });
    }

}
