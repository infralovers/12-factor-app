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
    print(request.json, flush=True)
    jsonRequest = request.json
    # Check if "data" and "message" keys are present before accessing
    if 'data' in jsonRequest and 'message' in jsonRequest['data']:
        data = jsonRequest['data']['message']
        print(data, flush=True)
    return jsonify({"status": "success"})

app.run()
