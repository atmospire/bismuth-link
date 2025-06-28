import { redirect } from "next/navigation";
import { Button, Container, Flex, Text, TextInput, Title } from "@mantine/core";
import { Routes } from "~/constants/routes";
import { DiscordLoginOverlay, MicrosoftLoginOverlay, ServerCard } from "~/modules";
import { auth } from "~/server/auth";
import { db } from "~/server/db";

// Force dynamic rendering to prevent prerendering during build
export const dynamic = "force-dynamic";

async function unlinkMicrosoft(data: FormData) {
    "use server";

    const userId = data.get("userId") as string;

    const account = await db.account.findFirst({
        where: {
            userId: userId,
            provider: "microsoft",
        },
    });

    await db.account.delete({
        where: {
            id: account?.id,
            userId: userId,
            provider: "microsoft",
        },
    });

    await db.user.update({
        where: {
            id: userId,
        },
        data: {
            javaName: "",
            bedrockName: "",
        },
    });

    void redirect(Routes.LINKING);
}

export default async function LinkingPage() {
    const session = await auth();

    if (session == null) return <DiscordLoginOverlay />;

    const servers = await db.userServer.findMany({
        where: {
            userId: session?.user.id,
        },
        include: {
            server: true,
        },
    });

    const accounts = await db.account.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const isUserLinked = accounts.find((x) => x.provider == "microsoft");

    return (
        <Flex direction={"column"} w={"100%"} h={"100%"} gap={"xs"} align={"center"} style={{ flexGrow: 1 }} p={"lg"}>
            {!isUserLinked ? (
                <MicrosoftLoginOverlay />
            ) : (
                <Container w={"100%"}>
                    <Flex direction={"column"} gap={"xs"} w={"100%"}>
                        <Title>Account Linking</Title>
                        <Text>
                            This is where you can unlink your Microsoft account and view your available servers to join!
                        </Text>
                        <Flex direction={"column"}>
                            <Title order={4}>Link information:</Title>

                            <Text>
                                Java Username:{" "}
                                {session.user.javaName.length == 0 ? (
                                    "[No Java Account]"
                                ) : (
                                    <Text span c="primary">
                                        {session.user.javaName}
                                    </Text>
                                )}
                            </Text>
                            <Text>
                                Bedrock Username:{" "}
                                {session.user.bedrockName.length == 0 ? (
                                    "[No Bedrock Account]"
                                ) : (
                                    <Text span c="primary">
                                        {session.user.bedrockName}
                                    </Text>
                                )}
                            </Text>
                        </Flex>

                        <form action={unlinkMicrosoft}>
                            <TextInput name="userId" type="hidden" value={session.user.id} readOnly />
                            <Button type="submit">Unlink Microsoft account</Button>
                        </form>
                        <Title order={2}>Available Servers:</Title>
                        <Text>
                            These are the servers you are able to join and are automatically white-listed on them.
                        </Text>
                        <Flex wrap={"wrap"} gap={"md"} maw={"100%"}>
                            {servers.map((server, index) => (
                                <ServerCard key={index} server={server.server} />
                            ))}
                        </Flex>
                    </Flex>
                </Container>
            )}
        </Flex>
    );
}
