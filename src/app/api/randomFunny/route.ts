import { db } from "~/server/db";

export async function GET() {
    try {
        const randomFunnies = await db.randomFunny.findMany({ include: { submittedByUser: true } });

        if (randomFunnies.length === 0) {
            return Response.json({ text: "insert funny text here", author: "system" }, { status: 200 });
        }

        const randomIndex = Math.floor(Math.random() * randomFunnies.length);
        const selectedFunny = randomFunnies[randomIndex];

        return Response.json({ text: selectedFunny?.funnyText, author: selectedFunny?.submittedByUser.name });
    } catch (error) {
        console.log(error);
        return Response.json({ text: "insert funny text here", author: "system" }, { status: 500 });
    }
}
