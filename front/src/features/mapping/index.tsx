import { Box, Button, Grid, GridItem, Select, Skeleton, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Route } from "../../models/route";
import { getCurrentPosition } from "../../shared/geolocation";
import { Map } from '../mapping/domain/map'
import { makeCarIcon, makeMarkerIcon } from '../../shared/icons'
import { sample, shuffle } from 'lodash'

const API_URL = import.meta.env.VITE_API_URL;

const googleMapsLoader = new Loader(import.meta.env.VITE_GOOGLE_API_KEY)

const colorMap = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
];

export const Mapping = () => {
  const mapRef = useRef<Map>();
  const [routeIdSelected, setRouteIdSelected] = useState<string | null>(null);
  const { data, isLoading } = useQuery(['routes'], () => 
    fetch(`${API_URL}/routes`)
      .then(res => res.json() as Promise<Route[]>)
  );

  const startRoute = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const routeSelected = data?.find(route => route._id === routeIdSelected)
    
    if (!routeSelected) return; 

    const color = sample(shuffle(colorMap)) as string;

    mapRef.current?.addRoute(routeSelected._id, {
      currentMarkerOptions: {
        position: routeSelected.startPosition,
        icon: makeCarIcon(color)
      },
      endMarkerOptions: {
        position: routeSelected.endPosition,
        icon: makeMarkerIcon(color)
      }      
    })
  }, [routeIdSelected]);

  useEffect(() => {
    (async () => {
      const [google, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true })
      ]);

      const divMap = document.getElementById('map') as HTMLElement
      mapRef.current = new Map(divMap, {
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