import { signIn } from "next-auth/react";
import Button from "../components/Button";
import DashboardLayout from "./Dashboard";

export default function SignedOutPage() {
    return <DashboardLayout
        title="Equipment Booking App"
    >
        <p className="font-semibold text-lg">Debes iniciar sesión</p>
        <Button
            className="mt-2"
            onClick={() => void signIn('openid')}
        >Ingresar</Button>
    </DashboardLayout>
}