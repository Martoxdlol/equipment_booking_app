import { exec } from 'child_process'
import fs from 'fs'
import dotenv from 'dotenv';
import path from 'path';
import pkg from '../package.json' assert { type: "json" }
import express from 'express'

const tmpApp = express()

const tmpServer = tmpApp.listen(3000)

tmpApp.use((req, res) => {
    res.status(200).sendFile(path.resolve('./deploy/updating.html'))
})



dotenv.config();

const VERSION = pkg.version

const penv = process.env
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
penv.NODE_ENV = process.env.NODE_ENV || 'production';

const env = import('../src/env.mjs')

const local = path.resolve('.local')

if (!fs.existsSync(local)) {
    fs.mkdirSync(local);
}

env.then(async ({ env }) => {
    const lastEnvPath = path.resolve('.local', 'last_env.json')

    const exists = fs.existsSync(lastEnvPath) && fs.existsSync(path.resolve('./.next/BUILD_ID'))

    const envJson = JSON.stringify({
        ...env,
        version: VERSION
    })

    console.log("Found environment:", Object.keys(env))

    console.log("Storage path:", env.STORAGE_PATH)

    if (!exists) {
        console.log("Building for the first time...")
        await build()
        fs.writeFileSync(lastEnvPath, envJson)

        console.log("Already built, starting server...")
        process.exit(await run())
    } else {
        const lastEnv = JSON.parse(fs.readFileSync(lastEnvPath, 'utf-8'))

        if (envJson !== JSON.stringify(lastEnv)) {
            console.log("Config updated, re-building...")

            await build()
            fs.writeFileSync(lastEnvPath, envJson)

            console.log("Already built, starting server...")
            process.exit(await run())
        } else {
            console.log("Already built, starting server...")

            process.exit(await run())
        }
    }
})

/**
 * @param {string} command
 */
async function execStdIODirect(command) {
    return new Promise((resolve, reject) => {
        const p = exec(command, { env: process.env })
        p.stdout?.pipe(process.stdout)
        p.stderr?.pipe(process.stderr)

        p.addListener('exit', (code) => {
            console.log("Exit code:", code)
            if (code != 0) {
                return reject(code)
            }
            resolve(code)
        })

        p.addListener('error', (err) => {
            reject(err)
        })
    })
}

async function build() {
    await execStdIODirect('npx prisma db push --accept-data-loss')
    return await execStdIODirect('npm run build')
}

function run() {
    tmpServer.close()
    return execStdIODirect('npm run start')
}