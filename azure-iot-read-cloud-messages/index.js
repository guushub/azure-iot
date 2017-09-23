'use strict';
const EventHubClient = require('azure-event-hubs').Client;

const connectionString = 'GuusDevHub=>Shared access policies=>service=>Connection string - primary key';

const printError = (err) => {
    console.log(err.message);
};

const printMessage = (message) => {
    console.log('Message received: ');
    const messageJson = JSON.stringify(message.body);
    const messageObject = JSON.parse(messageJson);
    let messageToPrint = messageObject;

    if(messageObject.type === "Buffer" && messageObject.data) {
        const messageBuffer = Buffer.from(messageObject.data);
        messageToPrint = messageBuffer.toString();
    }
    console.log(messageToPrint);
    console.log('');
};

const getClientReceiver = (partitionId) => {
    return client
        .createReceiver('$Default', partitionId, { 'startAfterTime': Date.now() })
        .then((receiver) => {
            console.log('Created partition receiver: ' + partitionId);
            receiver.on('errorReceived', printError);
            receiver.on('message', printMessage);
        });
}

// In case of TypeError in frames.js, see: https://github.com/noodlefrenzy/node-amqp10/issues/322
const client = EventHubClient.fromConnectionString(connectionString);
client
    .open()
    .then(client.getPartitionIds.bind(client))
    .then((partitionIds) => {
        return partitionIds.map(getClientReceiver);
    })
    .catch(printError);
