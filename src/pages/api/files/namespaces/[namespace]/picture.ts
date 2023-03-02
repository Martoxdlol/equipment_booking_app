import type { NextApiHandler } from "next";
import { prisma } from "../../../../../server/db";

const handler: NextApiHandler = async (req, res) => {
    const namespace = req.query.namespace?.toString() || ''

    const ns = await prisma.namespaceSettings.findFirst({ where: { slug: namespace } })

    res.redirect(ns?.picture || '/colored-image.svg')
}

export default handler


// /api/files/namespaces/<ns>/picture