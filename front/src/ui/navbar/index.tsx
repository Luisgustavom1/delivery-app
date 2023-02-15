import { Center, Heading } from "@chakra-ui/react";
import { Car } from "phosphor-react";

export const Navbar = () => {

return (
    <Center as='header' w='full' bg='blackAlpha.400' p={4} display='flex' alignItems='center' justifyContent="flex-end" gap={3} color='whiteAlpha.800'>
      <Car size={32} weight="regular" color='currentColor' />
    </Center>
  );
};