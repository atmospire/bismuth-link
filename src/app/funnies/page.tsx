import { redirect } from "next/navigation";
import { Button, Container, Flex, Group, Text, TextInput, Title } from "@mantine/core";
import { Routes } from "~/constants/routes";
import { DiscordLoginOverlay, MicrosoftLoginOverlay, ServerCard } from "~/modules";
import { auth, signOut } from "~/server/auth";
import { db } from "~/server/db";

export default async function FunniesPage() {
    const session = await auth();

    if (session == null) return <DiscordLoginOverlay />;

    const funnies = await db.randomFunny.findMany({
        include: {
            submittedByUser: true,
        },
    });

    return (
        <Flex
            direction={"column"}
            w={"100%"}
            h={"100%"}
            gap={"xs"}
            justify={"center"}
            align={"center"}
            style={{ flexGrow: 1 }}
            p={"lg"}
        >
            <Container w={"100%"}>
                <Flex direction={"column"} gap={"xs"} w={"100%"}>
                    <Title>Page of funnies</Title>
                    <Text mb={"xl"}>
                        This is where logged in users can post random funny text that will appear under the title on the
                        main page.
                    </Text>

                    <Text>Maximum size of a funny is 64 characters.</Text>
                    <Group grow preventGrowOverflow wrap="nowrap">
                        <TextInput maxLength={64} name="funnyText" placeholder="insert funny here" />
                        <Button type="submit">Add a funny</Button>
                    </Group>
                    <Title order={2} mt={"xl"}>
                        Current funnies:
                    </Title>
                    {funnies.map((funny, index) => (
                        <Text key={index}>
                            [{funny.funnyText}] by {funny.submittedByUser.name}
                        </Text>
                    ))}
                </Flex>
            </Container>
        </Flex>
    );
}
