import { z } from "zod";
import sharp from "sharp";
import path from 'path'
import fs from 'fs/promises'
import sha256 from 'sha256'

import { createTRPCRouter, namespaceAdminProcedure, namespaceProcedure, namespaceReadableProcedure } from "../../trpc";
import { env } from "../../../../env.mjs";
import { TRPCError } from "@trpc/server";

export const filesRouter = createTRPCRouter({
    uploadImage: namespaceAdminProcedure.input(z.object({
        content: z.string(),
    })).mutation(async ({ ctx, input }) => {
        try {
            // Content as base64 to buffer
            const buffer = Buffer.from(input.content, 'base64')
            // Generate sha256 hash from buffer
            const hash = sha256(buffer)

            // Define possible filename
            const filename = path.resolve(env.STORAGE_PATH, 'images', `${hash}.webp`)
            // find possible existing file
            const fileExists = await checkFileExists(filename)

            // If file exists, return url
            if (fileExists) return {
                url: `/api/files/images/${hash}.webp`,
            }

            // Create sharp instance from buffer
            let sharpInstance = sharp(buffer)
            // Fix orientation
            sharpInstance = sharpInstance.rotate()
            // Resize image
            sharpInstance = sharpInstance.resize(128, 128, { fit: 'cover' })
            // Convert to webp buffer
            const webpBuffer = await sharpInstance.webp().toBuffer()
            // Generate new hash
            const webpHash = sha256(webpBuffer)
            // Define filename
            const webpFilename = path.resolve(env.STORAGE_PATH, 'images', `${webpHash}.webp`)
            // Create dir if not exists
            await fs.mkdir(path.resolve(env.STORAGE_PATH, 'images'), { recursive: true })
            // Write file
            await fs.writeFile(webpFilename, webpBuffer)

            console.log(`Imagen con hash ${webpHash} subida correctamente a ${webpFilename}`)

            return {
                url: `/api/files/images/${webpHash}.webp`,
            }
        } catch (error) {
            console.log("NO SE PUEDE SUBIR IMAGEN")
            console.log(error)
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Something went wrong while uploading the image',
            })
        }
    }),
    getAllImages: namespaceAdminProcedure.query(async ({ ctx }) => {
        await fs.mkdir(path.resolve(env.STORAGE_PATH, 'images'), { recursive: true })
        const files = await fs.readdir(path.resolve(env.STORAGE_PATH, 'images'))
        return files.map(file => ({
            url: `/api/files/images/${file}`,
        }))
    })
})

async function checkFileExists(file: string) {
    try {
        return !!(await fs.stat(file))
    } catch (error) {
        return false
    }
}