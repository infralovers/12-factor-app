# 12-factor-app

## Original repos

```shell
# dapr-distributed-calendar
https://github.com/dapr/samples

# distributed-calculator
https://github.com/dapr/quickstarts
```

## dapr-distributed-calendar

The dapr-distributed-calendar is now working perfectly. It is possible to do POST, DELETE and GET events.

### Possible operations with Postman are

POST: <http://localhost:3000/newevent>
Body:

```json
{
    "data": {
        "name": "Uninstall Event",
        "date": "TBD",
        "id": "1"
    }
}
```

DELETE: <http://localhost:3000/event/1>

GET: <http://localhost:3000/event/1>

### Setup with docker-compose

```shell
cd 12-factor-app/dapr-distributed-calendar
docker-compose up
```

### Setup with Kubernetes

```shell
cd 12-factor-app/dapr-distributed-calendar
./kubernetes-deploy.sh
```

Or pick specific parts of the deployment.
Every part of the deployment process that is not required, has a `OPTIONAL` comment!

**Traces** are gathered and send to the OpenTelemetry Collector with the build in dapr integration and then send to Jaeger.

**Metrics** are scraped by the OpenTelemetry Collector and then send to Prometheus. In addition, the nodejs application is instrumented manually to send additional non dapr metrics to the collector, but currently the metrics are only send to console output, which will be fixed in the next Sprint. The other microservices are yet to be instrumented.

**Logs** are currently send directly over fluentd to elasticsearch. Due to most logging implementations for OpenTelemetry still being under development, being experimental or not implemented yet, this is the most logical resolution. (Go not implemented yet, Python experimental, Node in development)

### About Auto-Instrumentation

It is theoretically possible to use auto-instrumentation for kubernetes, but sadly this is very buggy especially Go and Python. and even those that do work do not provide a very good instrumentation when it comes to metrics, traces and logs. Therefore thy have been uncommented in the code, but can still be found within the folder `12-factor-app/dapr-distributed-calendar/otel`.

## distributed-calculator

The distributed-calculator works, and I added DELETE and PUT to the already existing POST and GET requests:

```bash
curl -s http://localhost:8000/calculate/add -H Content-Type:application/json --data @operands.json
```

```bash
curl -s http://localhost:8000/calculate/subtract -H Content-Type:application/json --data @operands.json
```

```bash
curl -s http://localhost:8000/calculate/divide -H Content-Type:application/json --data @operands.json
```

```bash
curl -s http://localhost:8000/calculate/multiply -H Content-Type:application/json --data @operands.json
```

```bash
curl -s http://localhost:8000/persist -H Content-Type:application/json --data @persist.json
```

```bash
curl -s http://localhost:8000/state
```

```bash
curl -s -X PUT http://localhost:8000/state -H 'Content-Type: application/json' --data-raw '{"next": "12", "operation": "-" }' 
```

```bash
curl -s -X DELETE http://localhost:8000/state 
```
