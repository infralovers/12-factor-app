/*instrumentation.js*/
// only console exporter seems to work
const opentelemetry = require('@opentelemetry/api');
const {
  MeterProvider,
  ConsoleMetricExporter,
  PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');
const {
  OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-grpc');

const { Resource } = require('@opentelemetry/resources');
const {
  SemanticResourceAttributes,
} = require('@opentelemetry/semantic-conventions');

const resource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'controller',
    [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
  }),
);

const metricReader = new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
        url: 'http://otel-dapr-collector:4317',
    }),
    exporter: new ConsoleMetricExporter(),
});

const myServiceMeterProvider = new MeterProvider({
    resource: resource,
});

myServiceMeterProvider.addMetricReader(metricReader);

// Set this MeterProvider to be global to the app being instrumented.
opentelemetry.metrics.setGlobalMeterProvider(myServiceMeterProvider);




// possible other solution dont forget to set OTEL_EXPORTER_OTLP_METRICS_ENDPOINT env in pod
// const { MeterProvider, PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');
// const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-grpc');

// const metricExporter = new OTLPMetricExporter();
// const resource = Resource.default().merge(
//   new Resource({
//     [SemanticResourceAttributes.SERVICE_NAME]: 'controller',
//     [SemanticResourceAttributes.SERVICE_VERSION]: '0.1.0',
//   }),
// );
// const meterProvider = new MeterProvider({
//   resource: resource
// });

// meterProvider.addMetricReader(new PeriodicExportingMetricReader({
//   exporter: metricExporter,
//   exportIntervalMillis: 1000,
// }));

// // Set this MeterProvider to be global to the app being instrumented.
// opentelemetry.metrics.setGlobalMeterProvider(meterProvider);
