# # Use an official Golang runtime as a parent image
# FROM golang:1.16-alpine

# # Set the working directory to /app
# WORKDIR /app

# # Copy only the Go application code to the container
# COPY go_events.go .

# # go mod init
# RUN go mod init app

# # Install gorilla/mux package
# RUN go get -u github.com/gorilla/mux

# # Install Dapr
# RUN apk add --no-cache bash \
#     && wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash \
#     && apk del --no-cache bash

# # Build the go_events executable
# RUN go build -o go_events go_events.go

# # Set environment variables
# ENV DAPR_HTTP_PORT 3503
# ENV APP_PORT 6000
# ENV APP_ID go-events

# # Command to run the executable
# # CMD ["dapr", "run", "--app-id", "${APP_ID}", "--app-port", "${APP_PORT}", "--dapr-http-port", "${DAPR_HTTP_PORT}", "./go_events"]

# CMD sh -c "dapr run --app-id ${APP_ID} --app-port ${APP_PORT} --dapr-http-port ${DAPR_HTTP_PORT} ./go_events"

#first stage - builder
FROM golang:1.15-buster as builder
WORKDIR /dir
COPY go_events.go .
RUN go get -d -v
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
#second stage
FROM debian:buster-slim
WORKDIR /root/
COPY --from=builder /dir/app .
CMD ["./app"]