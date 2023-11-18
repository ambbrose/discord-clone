import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { toast } from "@/components/ui/use-toast";


const InviteCodePage = async ({ params }: { params: { inviteCode: string } }) => {

    const profile = await currentProfile();

    if (!profile) {
        return redirectToSignIn();
    };

    if (!params.inviteCode) {
        return redirect('/');
    };

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        toast({
            description: 'You are already a member of this server'
        });
        return redirect(`/servers/${existingServer.id}`);
    };

    const server = await db.server.update({
        where: {
            inviteCode: params.inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id
                    }
                ]
            }
        }
    });

    if(server) {
        return redirect(`/servers/${server.id}`);
    };

    return null;
};

export default InviteCodePage;