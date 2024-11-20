# 12-factor-app

## Original repos

```shell
# dapr-distributed-calendar
https://github.com/dapr/samples
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

### Local Setup

```shell
./local-setup.sh

```

### Setup with docker-compose

```shell
docker-compose up
```

### Setup with Kubernetes

```shell
./kubernetes-deploy.sh
```

Or pick specific parts of the deployment.
Every part of the deployment process that is not required, has a `OPTIONAL` comment!

**Traces** are gathered and send to the OpenTelemetry Collector with the build in dapr integration and then send to Jaeger.

**Metrics** are scraped by the OpenTelemetry Collector and then send to Prometheus. In addition, the nodejs application is instrumented manually to send additional non dapr metrics to the collector, but currently the metrics are only send to console output, which will be fixed in the next Sprint. The other microservices are yet to be instrumented.

**Logs** are currently send directly over fluentd to elasticsearch. Due to most logging implementations for OpenTelemetry still being under development, being experimental or not implemented yet, this is the most logical resolution. (Go not implemented yet, Python experimental, Node in development)

### About Auto-Instrumentation

It is theoretically possible to use auto-instrumentation for kubernetes, but sadly this is very buggy especially Go and Python. and even those that do work do not provide a very good instrumentation when it comes to metrics, traces and logs. Therefore thy have been uncommented in the code, but can still be found within the folder `12-factor-app/otel`.
