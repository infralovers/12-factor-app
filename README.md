# 12-factor-app

## distributed-calculator

The distributed-calculator works, but we do not have any delete operations, but we got PUT and Get statements:

   ```bash
   curl -s http://localhost:8080/calculate/add -H Content-Type:application/json --data @operands.json
   ```

   ```bash
   curl -s http://localhost:8080/calculate/subtract -H Content-Type:application/json --data @operands.json
   ```

   ```bash
   curl -s http://localhost:8080/calculate/divide -H Content-Type:application/json --data @operands.json
   ```

   ```bash
   curl -s http://localhost:8080/calculate/multiply -H Content-Type:application/json --data @operands.json
   ```

   ```bash
   curl -s http://localhost:8080/persist -H Content-Type:application/json --data @persist.json
   ```

   ```bash
   curl -s http://localhost:8080/state
   ```

## dapr-distributed-calendar

The dapr-distributed-calendar is not working perfectly. It is possible to do PUT and DELETE but not GET. In addition no put statement directly to the state store is possible like described in the documentation and same redis retryable errors.

### Possible operations with Postman are

PUT: <http://localhost:3001/newevent>
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

DELETE: <http://localhost:3001/event/1>

### What is not working is

PUT: <http://localhost:3001/v1.0/states/events/1>
Body:

```json
{
    "key": "1",
    "value": "Test Postman"
}
```

GET: <http://localhost:3001/v1.0/states/events/1>
