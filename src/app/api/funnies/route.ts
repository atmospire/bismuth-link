import { auth } from "~/server/auth";
import { db } from "~/server/db";

export async function GET() {
    try {
        const funnies = await db.randomFunny.findMany({ include: { submittedByUser: true } });

        return Response.json(funnies);
    } catch (error) {
        console.log(error);
        return Response.json({ text: "insert funny text here", author: "system" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { text } = await request.json();

        if (!text || typeof text !== "string" || text.trim().length === 0) {
            return Response.json({ error: "Funny text is required" }, { status: 400 });
        }

        const funny = await db.randomFunny.create({
            data: {
                funnyText: text.trim(),
                submittedByUserId: session.user.id,
            },
            include: {
                submittedByUser: true,
            },
        });

        return Response.json(funny);
    } catch (error) {
        console.error("Error creating funny:", error);
        return Response.json({ error: "Failed to create funny" }, { status: 500 });
    }
}
