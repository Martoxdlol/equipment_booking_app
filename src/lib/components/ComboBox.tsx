import { Fragment, useState } from 'react'
import { Combobox, Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const people = [
    // {
    //     value: 1,
    //     label: 'Wade Cooper',
    //     picture:
    //         'https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 2,
    //     label: 'Arlene Mccoy',
    //     picture:
    //         'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 3,
    //     label: 'Devon Webb',
    //     picture:
    //         'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80',
    // },
    // {
    //     value: 4,
    //     label: 'Tom Cook',
    //     picture:
    //         'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 5,
    //     label: 'Tanya Fox',
    //     picture:
    //         'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 6,
    //     label: 'Hellen Schmidt',
    //     picture:
    //         'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 7,
    //     label: 'Caroline Schultz',
    //     picture:
    //         'https://images.unsplash.com/photo-1568409938619-12e139227838?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 8,
    //     label: 'Mason Heaney',
    //     picture:
    //         'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 9,
    //     label: 'Claudie Smitham',
    //     picture:
    //         'https://images.unsplash.com/photo-1584486520270-19eca1efcce5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
    // {
    //     value: 10,
    //     label: 'Emil Schaefer',
    //     picture:
    //         'https://images.unsplash.com/photo-1561505457-3bcad021f8ee?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    // },
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function ComboBox(props: {
    label: React.ReactNode,
    options: { value: string, picture?: string | null, label: string, searchable?: string | null }[]
    onChange: (value: string) => void
    value: string | null | undefined
    placeHolder?: string
}) {
    const options = props.options || []

    const defaultOption = {
        label: props.placeHolder || 'Seleccionar',
        value: '',
        picture: null,
    }

    const selected = options?.find(o => o.value === props.value) || defaultOption

    const [query, setQuery] = useState('')

    let filtered =
        query === ''
            ? options
            : options.filter((option) => {
                return option.label.toLowerCase().includes(query.toLowerCase()) || option.searchable?.toLowerCase().includes(query.toLowerCase())
            });

    if (!filtered.length) filtered = [defaultOption]

    return (
        <Combobox value={selected} onChange={o => props.onChange(o.value)}>
            {({ open }) => (
                <>

                    <Combobox.Label className="block text-sm font-medium text-gray-700">{props.label}</Combobox.Label>
                    <div className="relative mt-1">
                        <Combobox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-1 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">

                            <Combobox.Input
                                className="block w-full flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm placeholder:text-black focus:outline-none"
                                onChange={(event) => setQuery(event.target.value)}
                                displayValue={(option) => ''}
                                placeholder={selected.label}
                                value={query}
                                onClick={() => setQuery('')}
                            />

                            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                                <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                            </span>
                        </Combobox.Button>

                        <Transition
                            show={open}
                            as={Fragment}
                            leave="transition ease-in duration-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Combobox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                {filtered?.map((option) => (
                                    <Combobox.Option
                                        key={option.value}
                                        className={({ active }) =>
                                            classNames(
                                                active ? 'text-white bg-indigo-600' : 'text-gray-900',
                                                'relative cursor-default select-none py-2 pl-3 pr-9'
                                            )
                                        }
                                        value={option}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex items-center">
                                                    {option.picture && <img src={option.picture} alt="" className="h-3 w-6 flex-shrink-0 rounded-full" />}
                                                    <span
                                                        className={classNames(selected ? 'font-semibold' : 'font-normal', 'ml-3 block truncate')}
                                                    >
                                                        {option.label}
                                                    </span>
                                                </div>

                                                {selected ? (
                                                    <span
                                                        className={classNames(
                                                            active ? 'text-white' : 'text-indigo-600',
                                                            'absolute inset-y-0 right-0 flex items-center pr-4'
                                                        )}
                                                    >
                                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))}
                            </Combobox.Options>
                        </Transition>
                    </div>
                </>
            )}
        </Combobox>
    )
}