import DashboardLayout from "../../lib/components/DashboardLayout"
import Input from "../../lib/components/Input"
import Label from "../../lib/components/Label"

export default function DashboardCreateNamespace() {
    return <DashboardLayout
        title="New namespace"
    >
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 mb-auto">
                <div>
                    <Label>Nombre</Label>
                    <Input placeholder="Escuela Técnica Henry Ford"/>
                </div>
                <div>
                    <Label>Identificador</Label>
                    <Input placeholder="ethf"/>
                </div>
            </div>
        </div>

    </DashboardLayout >
}