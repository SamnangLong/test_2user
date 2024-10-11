var connection_status = false;
var client;

setTimeout(function() {
    ConnectToMQTT();
}, 2000);

function ConnectToMQTT() {
    const randomClientNumber = Math.floor(Math.random() * 1000) + 1;
    const clientID = 'user' + randomClientNumber; // Generate unique user name
    const host = 'blithesome-chiropractor.cloudmqtt.com';
    const port = 443;

    client = new Paho.MQTT.Client(host, Number(port), clientID);
    
    // Set callback handlers
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;

    // Connect the client
    client.connect({
        onSuccess: onConnect,
        useSSL: true,
        userName: 'rwufzabs',
        password: 'kVZNw5Tuj6e5',
        mqttVersion: 4
    });
}

// Called when the client connects
function onConnect() {
    console.log("onConnect:" + client.clientId );
    connection_status = true;
    const subTopic = 'control_led'; // Subscribe to the control topic
    client.subscribe(subTopic);
}

// Function to publish data to MQTT topic
function publishToMQTT(message) {
    client.send('control_led', message);
}

// Called when the client loses its connection
function onConnectionLost(responseObject) {
    if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost: " + responseObject.errorMessage);
        alert("MQTT Connection Lost");
    }
}

// Called when a message arrives
function onMessageArrived(message) {
    console.log("onMessageArrived: " + message.payloadString);
    const [command, status, userId] = message.payloadString.split(',');

    // Check if the message is for the current user
    if (userId === client.clientId) {
        // Update status display based on the message received
        if (command === 'lamp') {
            const statusMessage = `Lamp is ${status} by ${userId}`;
            document.getElementById('status').innerText = statusMessage;
        }
    }
}

// Handle button clicks to control the lamp
document.getElementById('btnOn').addEventListener('click', function() {
    if (connection_status) {
        const message = `lamp,ON,${client.clientId}`; // Prepare the message format
        publishToMQTT(message); // Publish message to MQTT
        // document.getElementById('status').innerText = 'Lamp is ON';
    } else {
        alert("MQTT not connected");
    }
});

document.getElementById('btnOff').addEventListener('click', function() {
    if (connection_status) {
        const message = `lamp,OFF,${client.clientId}`; // Prepare the message format
        publishToMQTT(message); // Publish message to MQTT
        // document.getElementById('status').innerText = 'Lamp is OFF';
    } else {
        alert("MQTT not connected");
    }
});
