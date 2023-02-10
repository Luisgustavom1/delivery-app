import { Box, Button, Grid, GridItem, Select, Skeleton, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { google, Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Route } from "../../models/route";
import { getCurrentPosition } from "../../shared/geolocation";

const API_URL = import.meta.env.VITE_API_URL;

const googleMapsLoader = new Loader(import.meta.env.VITE_GOOGLE_API_KEY)

export const Mapping = () => {
  const mapRef = useRef<google.maps.Map>();
  const [routeIdSelected, setRouteIdSelected] = useState<string | null>(null);
  const { data, isLoading } = useQuery(['routes'], () => 
    fetch(`${API_URL}/routes`)
      .then(res => res.json() as Promise<Route[]>)
  );

  const startRoute = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const routeSelected = data?.find(route => route._id === routeIdSelected)
    
    if (!routeSelected) return; 

    const google = await googleMapsLoader.load();

    new google.maps.Marker({
      map: mapRef.current,
      position: {
        lat: routeSelected.startPosition.lat,
        lng: routeSelected.startPosition.lng
      },
    })
    new google.maps.Marker({
      map: mapRef.current,
      position: {
        lat: routeSelected.endPosition.lat,
        lng: routeSelected.endPosition.lng
      },
    })
  }, [routeIdSelected]);

  useEffect(() => {
    (async () => {
      const [google, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true })
      ]);

      const divMap = document.getElementById('map') as HTMLElement
      mapRef.current = new google.maps.Map(divMap, {
        zoom: 15,
        center: position
      })
    })()
  }, [])

  return (
    <Grid templateColumns='repeat(12, 1fr)' gap={8} height='100vh' padding='16px'>
      <GridItem as='aside' colSpan={4} marginTop='32px'>
        {isLoading ? (
            <Stack as='form' spacing='4'>
              <Skeleton height='40px' />
              <Skeleton height='40px' />
            </Stack>
          ) : (
            <Stack as='form' spacing='4' onSubmit={startRoute}>
              <Select placeholder='Select a route' onChange={e => setRouteIdSelected(e.target.value)}>
                {data?.map((route) => (
                  <option value={route._id} key={route._id}>{route.title}</option>
                ))}
              </Select>
              <Button type='submit' width='100%'>
                Iniciar corrida
              </Button>
            </Stack>
          )}
      </GridItem>
      <GridItem as='section' colSpan={8}>
        <Box id='map' height='100%'></Box>
      </GridItem>
    </Grid>
  );
};