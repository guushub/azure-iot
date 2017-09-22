'use strict';
const clientFromConnectionString = require('azure-iot-device-mqtt').clientFromConnectionString;
const Message = require('azure-iot-device').Message;

// Device connection string
//var connectionString = 'HostName=GuusDevHub.azure-devices.net;DeviceId=myFirstNodeDevice;SharedAccessKey=ELgmjN0DA9oUdXjl+Xk2vujoaBk7o9AVyU841kCgCIY=';
const connectionString = 'HostName=GuusDevHub.azure-devices.net;DeviceId=pi3Guus;SharedAccessKey=kgefDUFFvtKej+81CAJ9rh02ads8fO+qLsrUqrB2iBk='
const client = clientFromConnectionString(connectionString);

const printResultFor = (op) => {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}

const messageSend = () => {
  const temperature = 20 + (Math.random() * 15);
  const humidity = 60 + (Math.random() * 20);
  const lat = 52.358012 + ((Math.random() / 2) * (Math.round(Math.random()) * 2 - 1));
  const lng = 4.911451 + ((Math.random() / 2) * (Math.round(Math.random()) * 2 - 1));
  const location = { lat: lat, lng: lng };
  const data = JSON.stringify({ deviceId: 'pi3Guus', temperature: temperature, humidity: humidity, location: location });
  const message = new Message(data);
  message.properties.add('temperatureAlert', (temperature > 30) ? 'true' : 'false');
  console.log("Sending message: " + message.getData());
  client.sendEvent(message, printResultFor('send'));
}
const connectCallback = (err) => {
  if (err) {
    console.log('Could not connect: ' + err);
  } else {
    console.log('Client connected');
    // Create a message and send it to the IoT Hub every second
    setInterval(messageSend, 10000);
  }
};

client
  .open(connectCallback);

