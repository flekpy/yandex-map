package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

const portNumber = ":8000"

func main() {
	http.HandleFunc("/data", getData)
	log.Printf("Starting on port %v\n", portNumber)
	log.Fatal(http.ListenAndServe(portNumber, nil))
}

type payload struct {
	Sd             string `json:"$id"`
	Id             int    `json:"Id"`
	IsRemoved      bool   `json:"IsRemoved"`
	Location       string `json:"Location"`
	Name           string `json:"Name"`
	OrganizationId int    `json:"OrganizationId"`
	Size           int    `json:"Size"`
	SyncDate       string `json:"SyncDate"`
	SyncId         string `json:"SyncId"`
}

func getData(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Content-Type", "application/json")

	url := "http://agro.energomera.ru:3060/api/field?lastChangeDate=2022-01-01T10:00:00.000&skip=0&take=100"

	spaceClient := http.Client{
		Timeout: time.Second * 2,
	}

	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		log.Fatal(err)
	}
	res, getErr := spaceClient.Do(req)
	if getErr != nil {
		log.Fatal(getErr)
	}
	if res.Body != nil {
		defer res.Body.Close()
	}

	body, readErr := ioutil.ReadAll(res.Body)
	if readErr != nil {
		log.Fatal(readErr)
	}

	w.Write([]byte(body))
}
