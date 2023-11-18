import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function PATCH(
    request: Request,
    { params }: { params: { channelId: string } }
) {
    try {

        const profile = await currentProfile();

        const { name, type } = await request.json();

        const { searchParams } = new URL(request.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 });
        };

        if (!params.channelId) {
            return new NextResponse('Channel ID missing', { status: 400 });
        };

        if (name === 'general') {
            return new NextResponse("'general' channel cannot be edited", { status: 400 });
        };

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    update: {
                        where: {
                            id: params.channelId,
                            NOT: {
                                name: 'general'
                            }
                        },
                        data: {
                            name: name,
                            type: type
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('CHANNEL-PATCH-ERROR:- ', error);
        return new NextResponse('Internal Server Error:- ', { status: 500 });
    }
};



export async function DELETE(
    request: Request,
    { params }: { params: { channelId: string } }
) {
    try {

        const profile = await currentProfile();

        const { searchParams } = new URL(request.url);

        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorised", { status: 401 });
        };

        if (!serverId) {
            return new NextResponse('Server ID missing', { status: 400 });
        };

        if (!params.channelId) {
            return new NextResponse('Channel ID missing', { status: 400 });
        };

        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    delete: {
                        id: params.channelId,
                        name: {
                            not: 'general'
                        }
                    }
                }
            }
        });

        return NextResponse.json(server);

    } catch (error) {
        console.log('CHANNEL-DELETE-ERROR:- ', error);
        return new NextResponse('Internal Server Error:- ', { status: 500 });
    }
};