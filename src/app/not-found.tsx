import { Flex, rem, Text, Title } from "@mantine/core";

export default function NotFound() {
    return (
        <Flex direction={"column"} mih={"100vh"} w={"100%"} justify={"center"} align={"center"} gap={"sm"}>
            <Title size={rem(100)}>Page Not Found</Title>
            <Text>errrmmm... AWKWARD!</Text>
        </Flex>
    );
}
