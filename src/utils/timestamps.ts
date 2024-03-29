import type { PrismaClient } from "@prisma/client";
// import { isPrismaError } from "../lib/util/helpers";

export async function getTimeStamp(opts: {
    prisma: PrismaClient,
    namespaceId: string,
    timeId: string
    day: number,
    month: number,
    year: number,
}) {
    const date = await opts.prisma.date.upsert({
        where: {
            namespaceId_year_month_day: {
                namespaceId: opts.namespaceId,
                day: opts.day,
                month: opts.month,
                year: opts.year,
            },
        },
        update: {},
        create: {
            day: opts.day,
            month: opts.month,
            year: opts.year,
            namespaceId: opts.namespaceId,
        }
    })

    return await opts.prisma.timeStamp.upsert({
        where: {
            namespaceId_dateId_timeId: {
                namespaceId: opts.namespaceId,
                timeId: opts.timeId,
                dateId: date.id,
            }
        },
        update: {},
        create: {
            namespaceId: opts.namespaceId,
            timeId: opts.timeId,
            dateId: date.id,
        }
    })
    // async function tryFind() {
    //     return await opts.prisma.timeStamp.findFirst({
    //         where: {
    //             namespaceId: opts.namespaceId,
    //             timeId: opts.timeId,
    //             date: {
    //                 namespaceId: opts.namespaceId,
    //                 day: opts.day,
    //                 month: opts.month,
    //                 year: opts.year,
    //             }
    //         }
    //     })

    // }

    // const ts = await tryFind()
    // if (ts) return ts

    // try {
    //     return await opts.prisma.timeStamp.create({
    //         data: {
    //             namespace: {
    //                 connect: {
    //                     slug: opts.namespaceId
    //                 }
    //             },
    //             time: {
    //                 connect: {
    //                     id: opts.timeId
    //                 }
    //             },
    //             date: {
    //                 connectOrCreate: {
    //                     where: {
    //                         namespaceId_year_month_day: {
    //                             day: opts.day,
    //                             month: opts.month,
    //                             year: opts.year,
    //                             namespaceId: opts.namespaceId,
    //                         }
    //                     },
    //                     create: {
    //                         day: opts.day,
    //                         month: opts.month,
    //                         year: opts.year,
    //                         namespaceId: opts.namespaceId,
    //                     },
    //                 }
    //             }
    //         }
    //     })
    // } catch (error) {
    //     console.log(">>>>>>>>>>>>")
    //     console.log(">>>>>>>>>>>>")
    //     console.log(">>>>>>>>>>>>")
    //     console.log(error)
    //     if (isPrismaError(error) && error.code === "P2002") {
    //         const ts = await tryFind()
    //         if (ts) return ts
    //         throw error
    //     }
    //     throw error
    // }
}