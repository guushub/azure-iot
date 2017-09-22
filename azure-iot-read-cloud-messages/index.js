'use strict';
const EventHubClient = require('azure-event-hubs').Client;

const connectionString = 'HostName=GuusDevHub.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=Bg1G89erSM4O0K+TU69KQhFU3op9cim2O7GDbsaQIWg=';
//const connectionString = 'HostName=GuusDevHub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=OJdId0S7+S3QbH/2nz4PjIEjZybPZ21dqi14ZSNHz04=';

const printError = (err) => {
    console.log(err.message);
};

const printMessage = (message) => {
    console.log('Message received: ');
    console.log(JSON.stringify(message.body));
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
