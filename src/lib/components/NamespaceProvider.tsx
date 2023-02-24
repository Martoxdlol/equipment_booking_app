import { api } from "../../utils/api";

import React, { createContext, useContext } from "react";
import type { NamespaceSettings } from "@prisma/client";
import { analyzeApiError } from "../util/errors";

const NamespaceContext = createContext<{ namespace: NamespaceSettings | null, error: ReturnType<typeof analyzeApiError>['data'] | null, isInitialLoading: boolean }>({ namespace: null, error: null, isInitialLoading: false })

export default function NamespaceProvider({ children }: { children: React.ReactNode, }) {

    const { data: namespace, error, isInitialLoading } = api.namespace.current.useQuery()

    const apiError = analyzeApiError(error).data

    return (
        <NamespaceContext.Provider value={{ namespace: namespace || null, error: apiError, isInitialLoading }}>
            {children}
        </NamespaceContext.Provider>
    );
}

export function useNamespace() {
    const data = useContext(NamespaceContext)

    return data.namespace
}

export function useNamespaceInfo() {
    const data = useContext(NamespaceContext)

    return data
}
