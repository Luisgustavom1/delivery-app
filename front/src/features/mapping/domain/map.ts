export class Route {
  public currentMarket: google.maps.Marker
  public endMarker: google.maps.Marker

  constructor(
    options: RouteOptions
  ) {
    this.currentMarket = new google.maps.Marker(options.currentMarkerOptions)
    this.endMarker = new google.maps.Marker(options.endMarkerOptions)
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
    this.routes[id] = new Route({
      currentMarkerOptions: {
        ...routeOptions,
        map: this.map
      },
      endMarkerOptions: {
        ...routeOptions,
        map: this.map
      }
    })
  }
}

type RouteOptions = {
  currentMarkerOptions: google.maps.ReadonlyMarkerOptions;
  endMarkerOptions: google.maps.ReadonlyMarkerOptions;
}
