# #first stage - builder
# FROM golang:1.15-buster as builder
# WORKDIR /dir
# COPY go_events.go .
# RUN go get -d -v
# RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
# #second stage
# FROM debian:buster-slim
# WORKDIR /root/
# COPY --from=builder /dir/app .
# EXPOSE 6000
# CMD ["./app"]

# FROM golang:1.21-alpine
# WORKDIR /root
# COPY go_events.go .
# RUN go mod init go_events
# RUN go mod tidy
# RUN go get -d -v
# RUN go build go_events .
# EXPOSE 6000
# CMD ["./go_events"]

#first stage - builder
FROM golang:1.20.12-alpine as builder
WORKDIR /dir
COPY go_events.go .
RUN go mod init go_events
RUN go mod tidy
RUN go get -d -v
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .
#second stage
FROM debian:buster-slim
WORKDIR /root/
COPY --from=builder /dir/app .
EXPOSE 6000
CMD ["./app"]