export default function namespaceRow(slug: string) {
    return [
        {
            label: 'Resumen',
            href: '/' + slug,
        },
        {
            label: 'Pedidos',
            href: '/' + slug + '/bookings',
        },
        {
            admin: true,
            label: 'Equipamiento',
            href: '/' + slug + '/equipment',
        },
        {
            admin: true,
            label: 'Config',
            href: '/' + slug + '/settings',
        }
    ]
}
