import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

interface Props {
    radiusLeft?: boolean
    radiusRight?: boolean
    options: { label: string, value: string }[]
    onChange: (value: string) => void
    value?: string
    placeHolder?: string | null
}

export default function Select(props: Props) {


    return (
        <Menu as="div" className="relative inline-block text-left w-full">
            <div>
                <Menu.Button
                    className={classNames(
                        "mt-1 w-full cursor-default border border-gray-300 bg-white py-1 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm",
                        props.radiusLeft ? "rounded-l-md" : '',
                        props.radiusRight ? "rounded-r-md" : '',
                    )}
                >
                    <>
                        {props.options?.find(o => o.value === props.value)?.label || props.placeHolder || '...'}
                    </>
                    {/* <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" /> */}
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-[500px]">
                    <div className="py-1">
                        {props.options?.map(option => {
                            return <Menu.Item key={option.value}>
                                {({ active }) => (
                                    <a
                                        onClick={() => props.onChange(option.value)}
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm cursor-pointer'
                                        )}
                                    >
                                        {option.label}
                                    </a>
                                )}
                            </Menu.Item>
                        })}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}