import { useRouter } from "next/router";
import { api } from "./api";

export function useNamespaceSlug() {
    return useRouter().query.namespace?.toString() || ''
}

export function useIsAdmin() {
    const { data: isAdmin, error } = api.namespace.isAdmin.useQuery()
    return isAdmin
}

// export function usePermissions() {
//     api.namespace.permissions
// }