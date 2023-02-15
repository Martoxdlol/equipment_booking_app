import type { NamespaceSettings } from "@prisma/client";
import DashboardLayout from "./Dashboard";
import namespaceRow from "../util/namespaceRow";
import React from "react";
import NamespaceRoute from "./NamespaceRoute";

interface NamespaceRouteProps {
    children: (props: { namespace: NamespaceSettings }) => JSX.Element
}

export default function DashboardNamespaceRoute(props: NamespaceRouteProps) {
    return <NamespaceRoute>
        {({ namespace }) => <DashboardLayout
            title={namespace.name}
            row={namespaceRow(namespace.slug)}
        >
            {React.createElement(props.children, { namespace })}
        </DashboardLayout>}
    </NamespaceRoute>
}