interface U {
    name?: string | null;
    email?: string | null;
    id: string;
    user?: {
        name?: string | null;
        email?: string | null;
        id: string;
    } | null
}


export function nameOf(user: U | null | undefined, alt?: string | null): string {
    if(!user) return alt || "<sin nombre>"
    return user.name || user.user?.name || user.email || user.user?.email || user.id
}