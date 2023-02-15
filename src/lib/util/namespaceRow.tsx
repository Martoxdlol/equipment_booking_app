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
            label: 'Equipamiento',
            href: '/' + slug + '/equipment',
        },
        {
            label: 'Config',
            href: '/' + slug + '/settings',
        }
    ]
}
