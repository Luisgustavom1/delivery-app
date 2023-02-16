import { Box, Button, Flex, Select, Skeleton, Stack } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "google-maps";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Route } from "../../models/route";
import { getCurrentPosition } from "../../shared/geolocation";
import { Map } from '../mapping/domain/map'
import { makeCarIcon, makeMarkerIcon } from '../../shared/icons'
import { sample, shuffle } from 'lodash'
import { RoutesExistsError } from "../../errors/routes-exists";
import { useToast } from '@chakra-ui/react'
import * as io from 'socket.io-client'

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
  const toast = useToast()
  const { data: routes, isLoading } = useQuery(['routes'], () => 
    fetch(`${API_URL}/routes`)
      .then(res => res.json() as Promise<Route[]>)
  );
  const mapRef = useRef<Map>();
  const [routeIdSelected, setRouteIdSelected] = useState<string | null>(null);
  const socketIORef = useRef<io.Socket>()

  const finishRoute = useCallback((route: Route) => {
    toast({
      title: `${route?.title} finalizou!`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
    mapRef.current?.removeRoute(route._id)
  }, [toast])

  const startRoute = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    const routeSelected = routes?.find(route => route._id === routeIdSelected)
    
    try {
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
      socketIORef.current?.emit('new-direction', {
        routeId: routeIdSelected
      })
    } catch (error) {
      if (error instanceof RoutesExistsError) {
        toast({
          title: `${routeSelected?.title} já adicionado, espere finalizar!`,
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      toast({
        title: (error as Error).message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }, [routeIdSelected]);

  useEffect(() => {
    if (!socketIORef.current?.connected) {
      socketIORef.current = io.connect(API_URL)
      socketIORef.current.on('connect', () => {})
    }

    const handler = (data: {
      routeId: string;
      position: [number, number];
      finished: boolean;
    }) => {
      mapRef.current?.moveCurrentMarker(data.routeId, {
        lat: data.position[0],
        lng: data.position[1]
      })

      if (data.finished) {
        const route = routes?.find(route => route._id === data.routeId) as Route
 
        finishRoute(route)
      }
    }

    socketIORef.current.on('new-position', handler)
    return () => {
      socketIORef.current?.off('new-position', handler)
    }
  }, [routeIdSelected])

  useEffect(() => {
    (async () => {
      const [_, position] = await Promise.all([
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
    <Flex as='main' direction={["column", "row"]} justify='space-between' gap={8} height="calc(100vh - 64px)" width='full' padding={4}>
      <Box as='aside' minWidth="72" marginTop='32px'>
        {isLoading ? (
            <Stack as='form' spacing='4'>
              <Skeleton height='40px' />
              <Skeleton height='40px' />
            </Stack>
          ) : (
            <Stack as='form' spacing='4' onSubmit={startRoute}>
              <Select placeholder='Select a route' onChange={e => setRouteIdSelected(e.target.value)}>
                {routes?.map((route) => (
                  <option value={route._id} key={route._id}>{route.title}</option>
                ))}
              </Select>
              <Button type='submit' width='100%'>
                Start Run
              </Button>
            </Stack>
          )}
      </Box>
      <Box as='section' flex='1'>
        {isLoading && <Skeleton height='100%' />}
        <Box id='map' height='100%'></Box>
      </Box>
    </Flex>
  );
};