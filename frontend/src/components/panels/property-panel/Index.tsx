import type { PageDSL } from "@/core/schema/page"
import { useSchemaStore } from "@/store/schema-store"
import { useShallow } from "zustand/shallow"

export default function PropertyPanel() {
    const { selectedId, findItem, schema }= useSchemaStore(useShallow((state) => ({
        selectedId: state.selectedId,
        findItem: state.findItem,
        schema: state.schema as PageDSL,
    })))

    return (
        <div>
            { selectedId && findItem(selectedId, schema) && (
                <div style={{ whiteSpace: "pre" }}>
                    {JSON.stringify(findItem(selectedId, schema), null, 2)}
                </div>
            )}
        </div>
    )
}