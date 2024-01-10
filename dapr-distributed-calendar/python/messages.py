import json
import os

import flask
from flask import request, jsonify
from flask_cors import CORS

from dapr.clients import DaprClient

app = flask.Flask(__name__)
CORS(app)

dapr_port = os.getenv("DAPR_HTTP_PORT", 5000)

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
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 

if __name__ == "__main__":
    app.run(port=dapr_port)
