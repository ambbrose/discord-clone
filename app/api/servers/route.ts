import { v4 as uuidV4 } from "uuid";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { MemberRole } from "@prisma/client";


export async function POST(request: Request) {
    try {

        const { name, imgUrl } = await request.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name: name,
                imageUrl: imgUrl,
                inviteCode: uuidV4(),
                channels: {
                    create: [
                        { name: 'general', profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }
                    ]
                }
            }
        });

        return NextResponse.json(server);
        
    } catch (error) {
        console.log('SERVERS-POST-ERROR:- ', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};