export default function assetTypeRow(opts: { namespace: string, slug: string }) {
    return [
        {
            label: 'Anterior',
            href: '/' + opts.namespace + '/equipment',
        },
        {
            label: 'Equipos',
            href: '/' + opts.namespace + '/equipment/' + opts.slug,
        },
        {
            label: 'Modificar',
            href: '/' + opts.namespace + '/equipment/' + opts.slug + '/change',
        },
    ]
}
