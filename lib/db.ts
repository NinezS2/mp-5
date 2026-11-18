import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

if (!uri) {
    throw new Error("MongoDB URI is missing");
}

const client = new MongoClient(uri);

export async function getLinksCollection() {
    await client.connect();

    const db = client.db("url-shortener");
    return db.collection("links");
}