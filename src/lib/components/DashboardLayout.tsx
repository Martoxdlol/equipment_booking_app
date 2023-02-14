import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useNamespace } from "../../utils/hooks"

interface Props {
    children: React.ReactNode
    title?: string
    titleHref?: string
    row?: JSX.Element[]
}

export default function DashboardLayout(props: Props) {
    const namespace = useNamespace()
    const session = useSession()
    const router = useRouter()

    return <div className="flex h-screen flex-col">
        <div className="relative z-40 border-b bg-primary px-3 text-primary sm:px-6">
            <header className="relative mx-auto">
                <div className="flex items-center pt-3 pb-2 md:pt-4 md:pb-3">

                    <div className="mr-1 flex shrink-0 items-center">
                        <Link className="rounded text-primary" aria-label="Go to dashboard" href={`/`}>
                            {/* <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M-0.0981445 16C-0.0981438 7.16344 7.0653 -7.52254e-07 15.9019 0C22.399 5.67998e-07 27.9917 3.87258 30.4975 9.43544L9.3373 30.5956C8.42926 30.1866 7.56625 29.6953 6.75778 29.1313L19.8891 16H15.9019L4.58815 27.3137C1.69272 24.4183 -0.0981449 20.4183 -0.0981445 16Z" fill="currentColor"></path>
                                <path d="M31.9019 16.0055L15.9074 32C24.7396 31.997 31.8989 24.8377 31.9019 16.0055Z" fill="currentColor"></path>
                            </svg> */}
                            <img 
                                height={32}
                                width={32}
                                src="https://www.w3resource.com/w3r_images/javascript-math-image-exercise-40.svg"
                                alt="Color pattern"
                                className="rounded-[32px]"
                            />
                        </Link>
                    </div>
                    <div className="flex flex-grow items-center">
                        {session.status === 'unauthenticated' && <Link className="hidden items-center rounded p-1 text-lg font-medium leading-3 text-primary transition sm:flex" href="/api/auth/signin/openid">Ingresar</Link>}
                        {session.status === 'authenticated' && <Link className="hidden items-center rounded p-1 text-lg font-medium leading-3 text-primary transition sm:flex" href={props.titleHref || `/${namespace}`}>{props.title || session.data.user.name}</Link>}
                        {session.status === 'loading' && <a className="hidden items-center rounded p-1 text-lg font-medium leading-3 text-primary transition sm:flex">Cargando...</a>}

                    </div>
                    <div className="flex flex-none items-center">
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="16" cy="16" r="16" stroke="black" stroke-width="0" fill="brown" />
                        </svg>
                    </div>
                </div>
                {props.row && <div className="-mb-px flex space-x-3 overflow-x-auto sm:space-x-0">
                    {props.row.map((row, i) => {
                        return <React.Fragment key={i}>{row}</React.Fragment>
                    })}
                </div>}
            </header>
        </div>
        <main className="mx-auto w-full flex-1 px-3 py-4 sm:py-6 sm:px-6">
            <div className="mx-auto h-full max-w-7xl">
                {session.status === 'unauthenticated' && <>
                    <p>Debe iniciar sesión para continuar</p>
                    <button
                        onClick={() => {
                            void router.push("/api/auth/signin/openid")
                        }}
                        type="button"
                        className="box-border relative inline-flex items-center justify-center text-center no-underline leading-none whitespace-nowrap font-semibold rounded shrink-0 transition select-none overflow-hidden focus-ring hover:bg-secondary text-primary border border-secondary bg-primary h-4 py-1.5 px-2">
                        Iniciar sesión
                    </button>
                </>}
                {session.status === 'authenticated' && props.children}
            </div>
        </main>
    </div>
}

export function RowLink(props: {
    children: React.ReactNode,
    current?: boolean,
    href: string
}) {
    if (props.current) {
        return <Link className="whitespace-nowrap border-b pb-2 pt-1 leading-none text-primary transition sm:px-2 border-blue-600 font-semibold" href={props.href}>{props.children}</Link>
    }

    return <Link className="whitespace-nowrap border-b pb-2 pt-1 leading-none text-primary transition sm:px-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600" href={props.href}>{props.children}</Link>
}