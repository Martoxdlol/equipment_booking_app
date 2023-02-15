export const slugRegex = /^[a-z0-9\-\_\&]{5,25}$/
export function formatSlug(slug: string) {
    return slug
        .trim()
        .replaceAll(' ', '-')
        .toLowerCase()
        .replace(/[^a-z0-9-$\_]/gi, '')
}