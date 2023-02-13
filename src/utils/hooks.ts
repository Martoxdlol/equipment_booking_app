import { useRouter } from "next/router";

export function useNamespace() {
    return useRouter().query.namespace?.toString() || ''
}