import Image from "next/image";
import { useMemo } from "react";
import type { RouterOutputs } from "../../utils/api";

type Bookings = RouterOutputs['bookings']['getAllAsAdmin']
type Unpacked<T> = T extends (infer U)[] ? U : T;
type Booking = Unpacked<Bookings>
type EquipmentItems = Booking['equipment']
type UsedAssets = Booking['inUseAssets']

interface Props {
    equipment: EquipmentItems
    inUse?: UsedAssets
}

export default function BookingAssetIndicator(props: Props) {

    const usedAssetsByType = useMemo(() => {
        const map = new Map<string, number>()
        props.inUse?.forEach(asset => {
            const current = map.get(asset.asset.assetTypeId) || 0
            map.set(asset.asset.assetTypeId, current + 1)
        })
        return map
    }, [props.inUse])

    return <div>
        {props.equipment.map(item => {


            return <div key={item.id} className="inline-flex items-center border py-[1px] px-1 rounded-full mr-1">
                {item.assetType.picture && <Image alt={item.assetType.name} src={item.assetType.picture} height={20} width={20} />}
                {!item.assetType.picture && <p key={item.id} className="font-semibold text-sm">
                    {item.assetType.name}
                </p>}
                <p className="font-semibold px-1">{props.inUse ? `${usedAssetsByType.get(item.assetTypeId) || 0}/` : ''}{item.quantity}</p>
            </div>
        })}
    </div>
}