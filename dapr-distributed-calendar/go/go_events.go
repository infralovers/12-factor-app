package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gorilla/mux"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlpmetric/otlpmetricgrpc"
	"go.opentelemetry.io/otel/metric"
	sdkmetric "go.opentelemetry.io/otel/sdk/metric"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.21.0"
)

var daprPort = os.Getenv("DAPR_HTTP_PORT") // Dapr's default is 3500 if not configured

const stateStoreName = `events`

var stateURL = fmt.Sprintf(`http://localhost:%s/v1.0/state/%s`, daprPort, stateStoreName)

// Event represents an event, be it meetings, birthdays etc
type Event struct {
	Name string
	Date string
	ID   string
}

func newResource() (*resource.Resource, error) {
	return resource.Merge(resource.Default(),
		resource.NewWithAttributes(semconv.SchemaURL,
			semconv.ServiceName("go-events"),
			semconv.ServiceVersion("0.1.0"),
		))
}

func newMeterProvider(res *resource.Resource) (*sdkmetric.MeterProvider, error) {
	metricExporter, err := otlpmetricgrpc.New(context.Background())
	if err != nil {
		return nil, err
	}

	meterProvider := sdkmetric.NewMeterProvider(
		sdkmetric.WithResource(res),
		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter,
			// Default is 1m. Set to 3s for demonstrative purposes.
			sdkmetric.WithInterval(3*time.Second))),
	)
	otel.SetMeterProvider(meterProvider)
	return meterProvider, nil
}

var meter = otel.Meter("go-events")
var eventsCounter metric.Int64UpDownCounter

func init() {
	var err error
	eventsCounter, err = meter.Int64UpDownCounter(
		"events.counter",
		metric.WithDescription("Number of events."),
		metric.WithUnit("{events}"),
	)
	if err != nil {
		panic(err)
	}
}

func addEvent(w http.ResponseWriter, r *http.Request) {
	var event Event

	err := json.NewDecoder(r.Body).Decode(&event)
	if err != nil {
		log.Printf("Error while decoding: %e", err)
		return
	}
	log.Printf("Event Name: %s", event.Name)
	log.Printf("Event Date: %s", event.Date)
	log.Printf("Event ID: %s", event.ID)

	var data = make([]map[string]string, 1)
	data[0] = map[string]string{
		"key":   event.ID,
		"value": event.Name + " " + event.Date,
	}
	state, _ := json.Marshal(data)
	log.Print(string(state))

	resp, err := http.Post(stateURL, "application/json", bytes.NewBuffer(state))
	if err != nil {
		log.Fatalln("Error posting to state", err)
		return
	}
	eventsCounter.Add(context.Background(), 1)
	log.Printf("Response after posting to state: %s", resp.Status)
	http.Error(w, "All Okay", http.StatusOK)
}

func deleteEvent(w http.ResponseWriter, r *http.Request) {
	type Identity struct {
		ID string
	}
	var eventID Identity

	err := json.NewDecoder(r.Body).Decode(&eventID)
	if err != nil {
		log.Print("Error decoding id")
		return
	}

	deleteURL := stateURL + "/" + eventID.ID
	log.Printf("Delete URL: %s", deleteURL)

	req, err := http.NewRequest(http.MethodDelete, deleteURL, nil)
	if err != nil {
		log.Fatalln("Error creating delete request", err)
		return
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln("Error deleting event", err)
		return
	}
	log.Printf("Response after delete call: %s", resp.Status)

	defer resp.Body.Close()
	bodyBytes, _ := io.ReadAll(resp.Body)
	eventsCounter.Add(context.Background(), -1)
	log.Print(string(bodyBytes))
}

func getEvent(w http.ResponseWriter, r *http.Request) {
	type Identity struct {
		ID string `json:"id"`
	}
	var eventID Identity

	err := json.NewDecoder(r.Body).Decode(&eventID)
	if err != nil {
		log.Printf("Error decoding id")
		return
	}
	getURL := stateURL + "/" + eventID.ID
	req, err := http.NewRequest(http.MethodGet, getURL, nil)
	if err != nil {
		log.Fatalln("Error creating get request", err)
		return
	}
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln("Error getting event", err)
		return
	}
	log.Printf("Response after get call: %s", resp.Status)

	defer resp.Body.Close()
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Printf("Error reading response body: %v", err)
		return
	}

	log.Print(string(bodyBytes))
}

func main() {
	res, err := newResource()
	if err != nil {
		panic(err)
	}

	meterProvider, err := newMeterProvider(res)
	if err != nil {
		panic(err)
	}

	defer func() {
		if err := meterProvider.Shutdown(context.Background()); err != nil {
			log.Println(err)
		}
	}()

	otel.SetMeterProvider(meterProvider)

	router := mux.NewRouter()

	router.HandleFunc("/addEvent", addEvent).Methods("POST")
	router.HandleFunc("/deleteEvent", deleteEvent).Methods("POST")
	router.HandleFunc("/getEvent", getEvent).Methods("POST")
	log.Fatal(http.ListenAndServe(":6000", router))
}
