import { ChakraProvider } from "@chakra-ui/react"
import { Mapping } from "./features/mapping"

function App() {

  return (
    <ChakraProvider>
      <Mapping />
    </ChakraProvider>
  )
}

export default App
