export default function assetRow(opts: { namespace: string, slug: string, tag: string }) {
    return [
        {
            label: 'Anterior',
            href: '/' + opts.namespace + '/equipment/' + opts.slug,
        },
        {
            label: 'Detalle',
            href: '/' + opts.namespace + '/equipment/' + opts.slug + '/asset/' + opts.tag,
        },
        {
            label: 'Modificar',
            href: '/' + opts.namespace + '/equipment/' + opts.slug + '/asset/' + opts.tag + '/change',
        },
    ]
}
