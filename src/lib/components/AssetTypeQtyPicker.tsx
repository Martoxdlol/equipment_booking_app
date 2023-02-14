const className = "mt-1 cursor-default border border-gray-300 bg-white py-1 px-1 text-center text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"

export default function AssetTypeQtyPicker() {
    return <div
        className="grid sm:grid-cols-[1fr_58px_50px_50px] grid-cols-[1fr_45px_50px_45px]"
    >
        <button className={className + ' sm:rounded-r-md rounded-l-md '}>Notebook</button>
        <button className={className + ' sm:rounded-l-md sm:ml-[8px]'}>-</button>
        <button className={className}>10</button>
        <button className={className + ' rounded-r-md'}>+</button>
    </div>
}

