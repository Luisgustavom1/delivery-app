import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Mapping } from "./features/mapping"
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: Infinity
    }
  }
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Mapping />
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
