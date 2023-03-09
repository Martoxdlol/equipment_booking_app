import { exec } from 'child_process'
import fs from 'fs'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const penv = process.env
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
penv.NODE_ENV = process.env.NODE_ENV || 'production';

const env = import('../src/env.mjs')

env.then(async ({ env }) => {
    const lastEnvPath = path.resolve('.local', 'last_env.json')

    const exists = fs.existsSync(lastEnvPath) && fs.existsSync(path.resolve('./.next/BUILD_ID'))

    const envJson = JSON.stringify(env)

    if (!exists) {
        console.log("Building for the first time...")
        fs.writeFileSync(lastEnvPath, envJson)
        await build()

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
            resolve(code)
        })

        p.addListener('error', (err) => {
            reject(err)
        })
    })
}

function build() {
    return execStdIODirect('npm run build')
}

function run() {
    return execStdIODirect('npm run start')
}