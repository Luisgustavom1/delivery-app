package route

import (
	"bufio"
	"encoding/json"
	"errors"
	"os"
	"strconv"
	"strings"
)

type Route struct {
	ID        string     `json:"routeId"`
	ClientID  string     `json:"clientId"`
	Positions []Position `json:"positions"`
}

type PartialRoutePosition struct {
	ID       string    `json:"id"`
	ClientID string    `json:"clientId"`
	Position []float64 `json:"position"`
	Finished bool      `json:"finished"`
}

type Position struct {
	Lat  float64 `json:"lat"`
	Long float64 `json:"long"`
}

func (r *Route) LoadPositions() error {
	if r.ID == "" {
		return errors.New("Route id not informed")
	}

	file, err := os.Open("destinations/" + r.ID + ".txt")
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		coordinates := strings.Split(scanner.Text(), ",")

		lat, err := strconv.ParseFloat(coordinates[0], 64)
		if err != nil {
			return nil
		}
		long, err := strconv.ParseFloat(coordinates[1], 64)
		if err != nil {
			return nil
		}

		r.Positions = append(r.Positions, Position{
			Lat:  lat,
			Long: long,
		})
	}

	return nil
}

func (r *Route) ExportJsonPositions() ([]string, error) {
	var route PartialRoutePosition
	var result []string
	quantityOfPositions := len(r.Positions)

	route.ID = r.ID
	route.ClientID = r.ClientID
	route.Finished = true

	for index, position := range r.Positions {
		route.Position = []float64{position.Lat, position.Long}
		if quantityOfPositions-1 == index {
			route.Finished = true
		}
		jsonRoute, err := json.Marshal(route)
		if err != nil {
			return nil, err
		}
		result = append(result, string(jsonRoute))
	}

	return result, nil
}
