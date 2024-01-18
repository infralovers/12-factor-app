
const express = require('express');
const bodyParser = require('body-parser');
require('isomorphic-fetch');

const app = express();

app.use(bodyParser.json());

const daprPort = process.env.DAPR_HTTP_PORT || 3500;

const eventApp = `go-events`;
const invokeUrl = `http://localhost:${daprPort}/v1.0/invoke/${eventApp}/method`;

const topic = 'events-topic'
const pubsub_name = 'pubsub'
const publishUrl = `http://localhost:${daprPort}/v1.0/publish/${pubsub_name}/${topic}`;

const port = 3000;

const opentelemetry = require('@opentelemetry/api');

const myMeter = opentelemetry.metrics.getMeter('controller');

const newEventCounter = myMeter.createCounter('newEvents-call.counter');
const getEventCounter = myMeter.createCounter('getEvents-call.counter');
const deleteEventCounter = myMeter.createCounter('deleteEvents-call.counter');
const updateEventCounter = myMeter.createCounter('updateEvents-call.counter');

function send_notif(data) {
    var message = {
        "data": {
            "message": data,
        }
    };
    console.log("Message: ", message);

    fetch(publishUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),      
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to publish message.");
        }
        console.log("Successfully published message.");
    })
    .catch((error) => {
        console.error(error);
    });
}

app.post('/newevent', (req, res) => {
    newEventCounter.add(1);
    const data = req.body.data;
    const eventId = data.id;
    console.log("New event registration! Event ID: " + eventId);

    console.log("Data passed as body to Go", JSON.stringify(data))
    fetch(invokeUrl+`/addEvent`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        // Only post if event does not already exist
        const responseBodyString = await streamToString(response.body);

        // Check if response body contains "Event already exists"
        if (responseBodyString.includes("Event already exists")) {
            console.log("Event already exists.");
            res.status(404).send({ message: "Event already exists." });
            return;
        }
        
        if (!response.ok) {
            throw "Failed to persist state.";
        }

        console.log("Successfully persisted state.");
        res.status(200).send();        
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
    send_notif(data)
});

app.delete('/event/:id', (req, res) => {  
    deleteEventCounter.add(1);
    const key = req.params.id;      
    console.log('Invoke Delete for ID ' + key);         

    var obj = {"id" : key};
    console.log("Data passed as body to Go", JSON.stringify(obj))
    fetch(invokeUrl+'/deleteEvent', {
        method: "POST",  
        body: JSON.stringify(obj),  
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (!response.ok) {
            throw "Failed to delete state.";
        }
        // Only delete if event does exist
        const responseBodyString = await streamToString(response.body);

        // Check if response body contains "Event does not exists"
        if (responseBodyString.includes("Event does not exists")) {
            console.log("Event does not exists.");
            res.status(404).send({ message: "Event does not exists." });
            return;
        }

        console.log("Successfully deleted state.");
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });    
});

const streamToString = require('stream-to-string');

app.get('/event/:id', (req, res) =>{
    getEventCounter.add(1);
    const key = req.params.id;      
    console.log('Invoke Get for ID ' + key);         

    var obj = {"id" : key};
    console.log("Data passed as body to Go", JSON.stringify(obj))
    fetch (invokeUrl+'/getEvent', {
        method: "POST",  
        body: JSON.stringify(obj),  
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        if (!response.ok) {
            throw "Failed to get state.";
        }
        console.log("Successfully got state.");
        const responseBodyString = await streamToString(response.body);

        // Check if response body is empty
        if (responseBodyString.trim() === "") {
            console.log("No event found.");
            res.status(404).send({ message: "No event found." });
            return;
        }

        try {
            const responseBody = JSON.parse(responseBodyString);
            res.status(200).json(responseBody);
        } catch (error) {
            console.log("Error parsing JSON:", error);
            res.status(500).send({ message: "Error parsing JSON" });
        }
    }).catch((error) => {
        console.log(error);
        res.status(500).send({message: error});
    });
})

app.put('/updateevent', (req, res) => {
    updateEventCounter.add(1);

    const data = req.body.data;
    const eventId = data.id;
    console.log("Updating event! Event ID: " + eventId);

    console.log("Data passed as body to Go", JSON.stringify(data))

    // Assuming your Go service has an endpoint like '/updateEvent'
    fetch(invokeUrl + `/updateEvent`, {
        method: "PUT", // Use PUT method for updating
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(async (response) => {
        const responseBodyString = await streamToString(response.body);

        // Check if response body contains "Event does not exists"
        if (responseBodyString.includes("Event does not exists")) {
            console.log("Event does not exists.");
            res.status(404).send({ message: "Event does not exists." });
            return;
        }
        
        if (!response.ok) {
            throw "Failed to update event.";
        }

        console.log("Successfully updated event.");
        res.status(200).send();
    }).catch((error) => {
        console.log(error);
        res.status(500).send({ message: error });
    });
});

app.listen(port, () => console.log(`Node App listening on port ${port}!`));
