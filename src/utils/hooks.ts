import { useRouter } from "next/router";
import { api } from "./api";

export function useNamespaceSlug() {
    return useRouter().query.namespace?.toString() || ''
}

// export function usePermissions() {
//     api.namespace.permissions
// }