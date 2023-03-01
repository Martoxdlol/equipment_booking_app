export default function Card(props: {children: React.ReactNode}) {
    return <div className="shadow-md p-2 border bg-orange-100">
        {props.children}
    </div>
}