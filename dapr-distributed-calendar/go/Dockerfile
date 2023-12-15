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
EXPOSE 6000
CMD ["./app"]