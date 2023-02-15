import { useRouter } from "next/router";

export function useNamespaceSlug() {
    return useRouter().query.namespace?.toString() || ''
}