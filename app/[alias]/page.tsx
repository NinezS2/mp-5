import { redirect, notFound } from "next/navigation";
import { getLinksCollection } from "@/lib/db";

export default async function AliasPage({
                                            params,
                                        }: {
    params: Promise<{ alias: string }>;
}) {
    const { alias } = await params;

    const collection = await getLinksCollection();

    const link = await collection.findOne({ alias });

    if (!link) {
        notFound();
    }

    redirect(link.url);
}
