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


export async function deployMultipleAssetsAuto(assets: string[], bookingId: string, opts: {
    prisma?: typeof db | null,
    namespaceId: string
}) {
    const prisma = (opts?.prisma || db);

    for (const asset of assets) {
        await prisma.inUseAsset.upsert({
            where: {
                assetId: asset,
            },
            create: {
                assetId: asset,
                bookingId: bookingId,
                namespaceId: opts.namespaceId,
            },
            update: {
                bookingId: bookingId,
            }
        })

        // Log events

        const event = await prisma.equipmentUseEvent.findFirst({
            where: {
                assetId: asset,
                returnedAt: null,
            },
            orderBy: {
                deployedAt: 'desc',
            }
        })

        if (event && event.bookingId != bookingId) {
            await returnAsset(event.id, { prisma: prisma as unknown as typeof db, namespaceId: opts.namespaceId })
        }

        if (event && event.bookingId == bookingId) {
            console.log("Asset already deployed")
            continue
        }

        await deployAsset(asset, bookingId, { prisma: prisma as unknown as typeof db, namespaceId: opts.namespaceId })
    }
}

export async function returnMultipleAssetsAuto(assets: string[], opts: {
    prisma?: typeof db | null,
    namespaceId: string
}) {
    const prisma = (opts?.prisma || db);

    for (const asset of assets) {
        const event = await prisma.equipmentUseEvent.findFirst({
            where: {
                assetId: asset,
                returnedAt: null,
            },
            orderBy: {
                deployedAt: 'desc',
            }
        })

        if (event) {
            await returnAsset(event.id, { prisma: prisma as unknown as typeof db, namespaceId: opts.namespaceId })
        }
    }
}