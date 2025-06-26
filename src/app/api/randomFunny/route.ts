import type { NextRequest } from "next/server";
import { auth } from "~/server/auth";
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

export async function POST(req: NextRequest) {
    try {
        const session = await auth();

        if (session == null) {
            return Response.json({ status: 403 });
        }

        if (session.user.role != "Admin") {
            return Response.json({ status: 403 });
        }

        const body = await req.json();
        const { funnyText } = body;

        if (!funnyText || typeof funnyText !== "string") {
            return Response.json({ error: "Invalid funny text" }, { status: 400 });
        }

        const newFunny = await db.randomFunny.create({
            data: {
                funnyText: funnyText,
                submittedByUserId: session.user.id,
            },
        });

        return Response.json({ success: true, id: newFunny.id }, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json({ status: 500 });
    }
}
