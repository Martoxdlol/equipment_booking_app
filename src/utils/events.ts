import { prisma as db } from "../server/db";

export async function deployAsset(assetId: string, bookingId: string, opts: {
    prisma?: typeof db | null,
    namespaceId: string
}) {
    const now = new Date();
    const prisma = (opts?.prisma || db);
    const result = await prisma.equipmentUseEvent.create({
        data: {
            deployedAt: now.toISOString(),
            assetId: assetId,
            bookingId: bookingId,
            namespaceId: opts.namespaceId,
        },
        include: {
            booking: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true, email: true,
                        }
                    }
                }
            },
            asset: {
                select: {
                    tag: true,
                    id: true,
                    type: {
                        select: {
                            id: true,
                            slug: true
                        }
                    }
                }
            }
        }
    })
    console.log(`>>> [${now.toString()}] Asset with tag ${result.asset.tag} (id: ${result.asset.id}) and type ${result.asset.type.slug} (id: ${result.asset.type.id})`
        + ` deployed to ${result.booking.user.name} <${result.booking.user.email}>. Booking id: ${result.booking.id}, event id: ${result.id}.`)
    return result
}

export async function returnAsset(eventId: string, opts: {
    prisma?: typeof db | null,
    namespaceId: string
}) {
    const now = new Date();
    const prisma = (opts?.prisma || db);
    const result = await prisma.equipmentUseEvent.update({
        where: {
            id: eventId
        },
        data: {
            returnedAt: now.toISOString(),
        },
        include: {
            booking: {
                select: {
                    id: true,
                    user: {
                        select: {
                            name: true, email: true,
                        }
                    }
                }
            },
            asset: {
                select: {
                    tag: true,
                    id: true,
                    type: {
                        select: {
                            id: true,
                            slug: true
                        }
                    }
                }
            }
        }
    })
    console.log(`>>> [${now.toString()}] Asset with tag ${result.asset.tag} (id: ${result.asset.id}) and type ${result.asset.type.slug} (id: ${result.asset.type.id}) returned from ${result.booking.user.name} <${result.booking.user.email}>.`
        + ` Event id ${result.id}.`)

    return result
} 