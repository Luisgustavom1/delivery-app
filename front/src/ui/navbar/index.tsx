import { Center, Heading } from "@chakra-ui/react";
import { Car } from "phosphor-react";

export const Navbar = () => {

return (
    <Center as='header' w='100%' bg='whiteAlpha.400' p={2} display='flex' alignItems='center' gap={3} color='RGBA(255, 255, 255, 0.64)'>
      <Car size={32} weight="regular" color='currentColor' />
      <Heading as='h1' size='sm' color='currentColor'>Delivery App</Heading>
    </Center>
  );
};