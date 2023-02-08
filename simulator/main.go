package main

import (
	"fmt"
	"log"
	"simulator/route"
)

func main() {
	route := route.Route{
		ID:       "1",
		ClientID: "1",
	}
	route.LoadPositions()
	stringJson, err := route.ExportJsonPositions()
	if err != nil {
		log.Println(err.Error())
		return
	}
	fmt.Println(stringJson[0])
}
