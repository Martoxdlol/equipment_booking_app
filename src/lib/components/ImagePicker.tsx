import classNames from 'classnames'
import Image from 'next/image'
import { useCallback, useMemo } from 'react'
import { useDropzone } from 'react-dropzone'
import { api } from '../../utils/api'

interface Props {
    url?: string
    onChangeUrl?: (url: string | undefined) => unknown
}

export default function ImagePicker({ url, onChangeUrl }: Props) {
    const { mutateAsync: uploadImage } = api.files.uploadImage.useMutation()
    const { data: _images, refetch } = api.files.getAllImages.useQuery()


    const images = _images
    // const images = useMemo(() => {
    //     return _images?.sort((a, b) => {
    //         if (a.url === url) return -1
    //         if (b.url === url) return 1
    //         return 0
    //     })
    // }, [_images, url])

    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        const file = acceptedFiles[0]
        if (!file) return
        // Read file as base64
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            const base64 = reader.result
            if (typeof base64 !== 'string') return
            const content = base64.split(';base64,')[1]
            if (!content) return
            void uploadImage({ content }).then(({ url }) => {
                onChangeUrl?.(url)
                void refetch()
            })
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: false,
    })

    return (
        <div>
            <div {...getRootProps()} className={classNames("border rounded-md p-2 text-center", {
                'ring-2 border-blue-500': isDragActive,
            })}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                        <p className='text-blue-500'>Soltar imagen acá...</p> :
                        <p>Arrastre y suelte imagen acá o haga click</p>
                }
            </div>
            <div className='overflow-x-scroll whitespace-nowrap'>
                {images?.map((image, i) => {
                    return <div key={image.url} className={classNames('p-[1px] m-[3px] inline-block cursor-pointer', {
                        'ring ring-blue-500': image.url === url,
                    })}
                        onClick={() => image.url === url ? onChangeUrl?.(undefined) : onChangeUrl?.(image.url)}
                    >
                        <div className='bg-white'>
                            
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={image.url} alt={`(${i}° imagen)`} width={50} height={50} />
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}



