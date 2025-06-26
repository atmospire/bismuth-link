"use client";

import { Button, Container, Flex, Group, Text, TextInput, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { DiscordLoginOverlay, LoadOverlay, useCreateFunny, useFunnies } from "~/modules";
import { useSession } from "next-auth/react";

export default function FunniesPage() {
    const { data: session, status } = useSession({ required: false });

    const { data: funnies, isLoading } = useFunnies();
    const { mutate } = useCreateFunny();

    const form = useForm({
        mode: "uncontrolled",
        initialValues: {
            text: "",
        },
    });

    if (isLoading || status === "loading") return <LoadOverlay visible />;
    console.dir(funnies);

    if (session == null) return <DiscordLoginOverlay />;

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"} gap={"xs"} align={"center"} style={{ flexGrow: 1 }} p={"lg"}>
            <Container w={"100%"}>
                <Flex direction={"column"} gap={"xs"} w={"100%"}>
                    <Title>Page of funnies</Title>
                    <Text mb={"xl"}>
                        This is where logged in users can post random funny text that will appear under the title on the
                        main page.
                    </Text>

                    <Text>Maximum size of a funny is 64 characters.</Text>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            form.reset();
                            mutate(values.text);
                        })}
                    >
                        <Group grow preventGrowOverflow wrap="nowrap">
                            <TextInput
                                maxLength={64}
                                name="funnyText"
                                placeholder="insert funny here"
                                key={form.key("text")}
                                {...form.getInputProps("text")}
                            />
                            <Button type="submit">Add a funny</Button>
                        </Group>
                    </form>
                    <Title order={2} mt={"xl"}>
                        Current funnies:
                    </Title>
                    {funnies?.length == 0 && <Text>No funnies created yet :(</Text>}
                    {funnies?.map((funny, index) => (
                        <Text key={index}>
                            [{funny.funnyText}] by {funny.submittedByUser.name}
                        </Text>
                    ))}
                </Flex>
            </Container>
        </Flex>
    );
}
