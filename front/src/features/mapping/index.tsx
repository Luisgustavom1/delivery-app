import { Box } from "@chakra-ui/react";
import { useState } from "react";
import { Route } from "./models/route";

const API_URL = import.meta.env.API_URL

export const Mapping = () => {
  const [routes, setRoutes] = useState<Route[]>([]);

  return (
    <Box>
      oi
    </Box>
  );
};