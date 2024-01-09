FROM node:17-alpine

WORKDIR /app
COPY . .
RUN npm install
RUN npm install @opentelemetry/api @opentelemetry/resources \
                @opentelemetry/semantic-conventions \
                @opentelemetry/sdk-node \
                @opentelemetry/sdk-metrics\
                @opentelemetry/exporter-metrics-otlp-grpc

EXPOSE 3000
CMD [ "node", "--require", "./instrumentation.js", "node_controller.js"]