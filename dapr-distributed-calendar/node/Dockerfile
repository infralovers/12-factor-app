# without instrumentation
# FROM node:17-alpine
# WORKDIR /app
# COPY . .
# RUN npm install
# # RUN npm install cloudevents
# EXPOSE 3000
# CMD [ "node", "node_controller.js" ]

# with manual instrumenatation
FROM node:17-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install @opentelemetry/api @opentelemetry/resources @opentelemetry/semantic-conventions
RUN npm install @opentelemetry/sdk-node
RUN npm install @opentelemetry/sdk-metrics
# RUN npm install @opentelemetry/exporter-metrics-otlp-proto
RUN npm install @opentelemetry/exporter-metrics-otlp-grpc
# RUN npm install cloudevents
EXPOSE 3000
CMD [ "node", "--require", "./instrumentation.js", "node_controller.js"]