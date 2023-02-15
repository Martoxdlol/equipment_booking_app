import { api } from "../../utils/api";

import React, { createContext, useContext } from "react";
import type { NamespaceSettings } from "@prisma/client";

const NamespaceContext = createContext<NamespaceSettings | null>(null)

export default function NamespaceProvider({ children }: { children: React.ReactNode, }) {

    const { data: namespace } = api.namespace.current.useQuery()

    return (
        <NamespaceContext.Provider value={namespace || null}>
            {children}
        </NamespaceContext.Provider>
    );
}

export function useNamespace() {
    const namespace = useContext(NamespaceContext)

    return namespace
}

