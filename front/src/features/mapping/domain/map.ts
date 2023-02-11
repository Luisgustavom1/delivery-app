import { RoutesExistsError } from "../../../errors/routes-exists";

export class Route {
  public currentMarket: google.maps.Marker
  public endMarker: google.maps.Marker
  private directionsRenderer: google.maps.DirectionsRenderer;

  constructor(
    options: RouteOptions
  ) {
    this.currentMarket = new google.maps.Marker(options.currentMarkerOptions)
    this.endMarker = new google.maps.Marker(options.endMarkerOptions)

    const strokeColor = (this.currentMarket.getIcon() as google.maps.ReadonlySymbol).strokeColor;
    this.directionsRenderer = new google.maps.DirectionsRenderer({
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: strokeColor,
        strokeOpacity: 0.5,
        strokeWeight: 5
      }
    })

    const map = this.currentMarket.getMap() 
    if (!map) return
    this.directionsRenderer.setMap(map as google.maps.Map)

    this.calculateRoute()
  }

  private calculateRoute() {
    const currentPosition = this.currentMarket.getPosition();
    const endPosition = this.currentMarket.getPosition();

    if (!currentPosition || !endPosition) return

    new google.maps.DirectionsService().route({
      origin: currentPosition,
      destination: endPosition,
      travelMode: google.maps.TravelMode.DRIVING
    }, (result, status) => {
      if (status === "OK") {
        this.directionsRenderer.setDirections(result)
        return;
      }

      throw new Error(status)
    })
  }
}

export class Map {
  public map: google.maps.Map;
  public routes: { [id: string]: Route } = {}

  constructor(
    element: Element,
    options: google.maps.MapOptions,
  ) {
    this.map = new google.maps.Map(element, options);
  }

  addRoute(
    id: string,
    routeOptions: RouteOptions
  ) {
    if (id in this.routes) {
      throw new RoutesExistsError();
    }

    this.routes[id] = new Route({
      currentMarkerOptions: {
        ...routeOptions.currentMarkerOptions,
        map: this.map
      },
      endMarkerOptions: {
        ...routeOptions.endMarkerOptions,
        map: this.map
      }
    })

    this.fitBounds()
  }

  private fitBounds() {
    const bounds = new google.maps.LatLngBounds()

    Object.keys(this.routes).forEach((id) => {
      const route = this.routes[id]      
      bounds.extend(route.currentMarket.getPosition() as google.maps.LatLng)
      bounds.extend(route.endMarker.getPosition() as google.maps.LatLng)
    })

    this.map.fitBounds(bounds)
  }
}

type RouteOptions = {
  currentMarkerOptions: google.maps.ReadonlyMarkerOptions;
  endMarkerOptions: google.maps.ReadonlyMarkerOptions;
}
