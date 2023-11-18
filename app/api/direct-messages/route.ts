import { DirectMessage } from "@prisma/client";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";


const DIRECT_MESSAGES_BATCH = 10;

export async function GET(req: Request) {
    try {
        const profile = await currentProfile();

        const { searchParams } = new URL(req.url);

        const cursor = searchParams.get("cursor");
        const conversationId = searchParams.get("conversationId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        if (!conversationId) {
            return new NextResponse("Channel ID is required", { status: 400 });
        };

        let messages: DirectMessage[] = [];

        if (cursor) {
            messages = await db.directMessage.findMany({
                take: DIRECT_MESSAGES_BATCH,
                skip: 1,
                cursor: {
                    id: cursor
                },
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        } else {
            messages = await db.directMessage.findMany({
                take: DIRECT_MESSAGES_BATCH,
                where: {
                    conversationId: conversationId
                },
                include: {
                    member: {
                        include: {
                            profile: true
                        }
                    }
                },
                orderBy: {
                    createdAt: "desc"
                }
            });
        };

        let nextCursor = null;

        if (messages.length === DIRECT_MESSAGES_BATCH) {
            nextCursor = messages[DIRECT_MESSAGES_BATCH - 1].id;
        };

        return NextResponse.json({
            items: messages,
            nextCursor: nextCursor
        });

    } catch (error) {
        console.log("DIRECT-MESSAGE-GET-ERROR:-", error);
        return new NextResponse("Internal server error", { status: 500 });
    };
};