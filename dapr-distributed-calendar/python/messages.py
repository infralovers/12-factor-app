import flask
from flask import request, jsonify
from flask_cors import CORS
import json
import sys
import time

from dapr.clients import DaprClient

app = flask.Flask(__name__)
CORS(app)

# dapr calls this endpoint to register the subscriber configuration
# an alternative way would to be declare this inside a config yaml file
@app.route('/dapr/subscribe', methods=['GET'])
def subscribe():
    subscriptions = [{'pubsubname': 'pubsub',
                      'topic': 'events-topic',
                      'route': 'getmsg'}]
    return jsonify(subscriptions)
        
# subscriber acts as a listener for the topic events-topic
@app.route('/getmsg', methods=['POST'])
def subscriber():
    jsonRequest = request.json
    # remove first data segment from {'data': {'data': {'message': {'date': 'TBD', 'id': '1', 'name': 'Uninstall Event'}}}
    # Check if 'data' key exists in the JSON payload
    if 'data' in jsonRequest:
        inner_data = jsonRequest['data'].get('data')

    # Update the JSON payload with the inner 'data' dictionary
    if inner_data:
        jsonRequest['data'] = inner_data
    # data = jsonRequest["data"]["message"]
    # Check if 'data' and 'message' keys are present
    data = jsonRequest.get("message")

    if data is not None:
        print(data, flush=True)
        # send_email()
    else:
        print("'message' key not found in JSON payload.", flush=True)

    return jsonify({"status": "success"})

app.run()