import { AssetRoute } from "../../../../../lib/layouts/AssetRoute"
import DashboardLayout from "../../../../../lib/layouts/Dashboard"

export default function DashboardAsset() {
    return <AssetRoute>
        {function Render({ asset }) {
            return <DashboardLayout title={asset.tag}>
                {asset.name && <h1 className="font-semibold text-xl">{asset.name}</h1>}
            </DashboardLayout>
            
        }}
    </AssetRoute>
}