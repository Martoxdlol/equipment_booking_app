import type { NextApiHandler } from "next";

import fs from 'fs/promises'
import { env } from "../../../../env.mjs";
import path from "path";

const handler: NextApiHandler = async (req, res) => {
    const hash = req.query.hash?.toString()?.split('.webp')[0] || ''
    // test if hash os valid sha256 hash
    if (!hash.match(/^[a-f0-9]{64}$/)) {
        res.status(404).end()
        return
    }

    const filename = path.resolve(env.STORAGE_PATH, 'images', `${hash}.webp`)

    try {
        const file = await fs.readFile(filename)
        res.setHeader('Content-Type', 'image/webp')
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        res.status(200).send(file)
    } catch (error) {
        res.redirect('/no-image.png')
    }
}

export default handler


