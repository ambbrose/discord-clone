import { v4 as uuidV4 } from "uuid";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";

export async function DELETE(
    request: Request,
    { params }: { params: { serverId: string } }
) {
    try {

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        const server = await db.server.delete({
            where: {
                id: params.serverId,
                profileId: profile.id
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('SERVERS-DELETE-ERROR:- ', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    };
};

export async function PATCH(
    request: Request,
    { params }: { params: { serverId: string } }
) {
    try {

        const { name, imgUrl } = await request.json();

        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        const server = await db.server.update({
            where: {
                id: params.serverId,
                profileId: profile.id
            },
            data: {
                name: name,
                imageUrl: imgUrl
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('SERVERS-PATCH-ERROR:- ', error);
        return new NextResponse("Internal Server Error", { status: 500 });
    };
};