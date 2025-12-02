import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PageDSL } from "@/core/schema/page";
import { nanoid } from "nanoid";

interface SchemaState {
    // 页面组件树
    schema: PageDSL | null;
    // 更新页面组件树
    setSchema: () => void;
}

const defaultSchema: PageDSL = {
    id: nanoid(),
    name: "",
    type: "RootContainer",
    props: {
        title: "",
        description: "",
    },
    settings: {
        width: "100%",
        height: "100%",
    },
    children: [],
}

export const useSchemaStore = create<SchemaState>()(
    immer((set, get) => ({
        // 页面组件树
        schema: null,

        // 初始化页面组件树
        setSchema: () => {
            set((state) => {
                state.schema = defaultSchema;
            });
        },        
    })
))