---
date: "2021-03-31"
tagline: "Using NodeJS and AWS SDK v3"
---

# Paginating Large DynamoDB Queries

The DynamoDB API limits a query response to 1MB of data.
This means that if you are running large queries, you will likely need to paginate the results.
Fortunately, the SDK provides an easy mechanism for making multiple queries in a sequence until all of the results have been returned.

In this article, I use the latest version, v3, of the [AWS SDK for Javascript](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/index.html) to make a large query to DynamoDB using multiple calls. 
I also use an asynchronous generator function that works well for this use case since we do not know ahead of time how many calls will need to be made.

Lets say you would like to return all of the records for a particular partition key. 
There may be anywhere from a few items to over 100k items.
For each query that we make, the SDK returns a `LastEvaluatedKey` in the response.
If this value is set, then there are more items to fetch.
If this value is undefined, then we have reached the end of the query.
So I set up an async generator to take the partition key and yield a set of items for each call.
The generator only returns once it has reached the end of the query.

It also makes sense to set a reasonable `Limit` in the parameters so that we get a consistent number of items in each call.
One quirk about DynamoDB is that the data is serialized using a typed json format.
So, I take care to "unmarshall" the data into standard json before yeilding the results.


```js
const { DynamoDBClient, QueryCommand } = require('@aws-sdk/client-dynamodb')
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb')

async function * queryGenerator (partitionKey) {

    let LastEvaluatedKey = null
    const client = new DynamoDBClient ({ region: 'us-east-1' })

    do {

        const command = new QueryCommand({
            TableName: process.env.DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pk = :pk',
            ExpressionAttributeValues: marshall({ ':pk': partitionKey }),
            Limit: 1000,
            ExclusiveStartKey: LastEvaluatedKey
        })

        const response = await client.send(command)
        LastEvaluatedKey = response['LastEvaluatedKey']

        const items = response.Items.map(unmarshall)
        yield items

    } while (LastEvaluatedKey)

}
```

Now, to show a simple use of the generator, lets put together some code that will collect all of the results. 
Here, I use the `for await of` syntax, which is designed for this use case.
It abtracts some of the boilerplate of dealing with async generators so that we can loop through the page results as if it were a simple array.

```js
async function query (partitionKey) {

    let results = []
    let generator = queryGenerator(partitionKey)

    for await (const items of generator) {

        results = results.concat(items)

    }

    return results

}
```

And there you have it, a straightforward paginated DynamoDB query using the latest SDK and modern Javascript. 
There is still a lot of housekeeping to be done depending on your use case.
This may include error handling, throttled requests, dealing with the data, and potential memory issues.
Check back for follow-up articles on these topics.