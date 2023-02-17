import { z } from "zod";

import { createTRPCRouter, namespaceProcedure, } from "../../trpc";
import type { ElegibleTime, PrismaClient } from "@prisma/client";


export const bookingsRoute = createTRPCRouter({
    bookableEquipment: namespaceProcedure.query(async ({ ctx }) => {

    })
})

async function getBookingAvaliability(opts: {namespaceId: string, prisma: PrismaClient, start: ElegibleTime, end: ElegibleTime}) {
    const types = await opts.prisma.assetType.findMany({
        where: {
            namespaceId: opts.namespaceId,
            enabled: true
        },
        include: {
            assets: {
                where: {
                    
                }
            }
        }
    })
}