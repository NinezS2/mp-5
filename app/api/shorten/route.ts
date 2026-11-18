import { NextResponse } from "next/server";
import { MongoServerError } from "mongodb";
import { getLinksCollection } from "@/lib/db";

export async function POST (request: Request) {
    const {url, alias} = await request.json();

    if (typeof url !== "string" || typeof alias !== "string" || !url.trim() || !alias.trim()) {
        return NextResponse.json(
            { error: "Please fill in both fields." },
            { status: 400 }
        );
    }

    try {
        const parsed = new URL(url);

        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
            throw new Error("invalid protocol");
        }
    } catch {
        return NextResponse.json(
            { error: "Please enter a valid URL." },
            { status: 400 }
        );
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(alias)) {
        return NextResponse.json(
            { error: "Alias can only contain letters, numbers, - and _." },
            { status: 400 }
        );
    }

    try {
        const collection = await getLinksCollection();

        await collection.createIndex({ alias: 1 }, { unique: true });
        await collection.insertOne({ url, alias });

        return NextResponse.json({ alias }, { status: 201 });
    } catch (error) {
        if (error instanceof MongoServerError && error.code === 11000) {
            return NextResponse.json(
                { error: "That alias is already taken!" },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong." },
            { status: 500 }
        );
    }
}