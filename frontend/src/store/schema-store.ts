import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PageDSL } from "@/core/schema/page";
import { nanoid } from "nanoid";
import type { ComponentNode } from "@/core/schema/basic";
import { useTreeOperation } from "@/hooks/useTreeOperation";

const { findNodeById, addNodeToParent, removeNodeById, updateNodeById } = useTreeOperation();

/**
 * 页面 DSL 的状态容器
 * 统一封装对 schema 的增删改查操作
 */
interface SchemaState {
    // 页面组件树
    schema: PageDSL | null;
    // 当前选中的组件 id（用于属性面板、图层面板等联动）
    selectedId: string | null;

    // 初始化页面组件树
    setSchema: () => void;

    // 更新当前选中的组件 id
    setSelectedId: (id: string | null) => void;

    // 查找节点
    findItem: (id: string, componentNode: ComponentNode | PageDSL)=> ComponentNode | PageDSL | null,
    
    // 新增节点
    addItem: (parentId: string, newNode: ComponentNode) => boolean,
    
    // 删除节点
    removeItem: (id: string) => boolean,
    
    // 更新节点
    updateItem: (id: string, updates: Partial<ComponentNode>) => boolean,
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

/**
 * 页面 schema 的全局 store
 * - 负责初始化页面 DSL
 * - 提供对组件树的查找 / 新增 / 删除 / 更新方法
 */
export const useSchemaStore = create<SchemaState>()(
    immer((set, get) => ({
        // 页面组件树
        schema: null,
        // 当前选中的组件 id，初始为空
        selectedId: null,

        // 初始化页面组件树
        setSchema: () => {
            set((state) => {
                state.schema = defaultSchema;
            });
        },

        // 更新当前选中的组件 id
        setSelectedId: (id: string | null) => {
            set((state) => {
                state.selectedId = id;
            });
        },

        /**
         * 查找组件树中的某个组件
         * @param id 组件id
         * @param componentNode 组件树节点
         * @returns 
         */
        findItem: (
            id: string, 
            componentNode: ComponentNode | PageDSL,
        ): ComponentNode | PageDSL | null => {
            // 对外暴露的查找接口，内部复用通用 DFS 函数
            return findNodeById(id, componentNode);
        },

        /**
         * 在指定父节点下添加新节点
         * @param parentId 父节点id
         * @param newNode 要添加的新节点
         * @returns 是否添加成功
         */
        addItem: (parentId: string, newNode: ComponentNode): boolean => {
            const { schema } = get();
            if (!schema) return false;

            let success = false;
            set((state) => {
                if (!state.schema) return;
                // 通过通用工具函数向指定父节点添加子节点
                // 注意：依赖 immer 提供的草稿对象，直接修改即可触发更新
                success = addNodeToParent(parentId, state.schema, newNode);
            });

            return success;
        },

        /**
         * 删除指定ID的节点
         * @param id 要删除的节点id
         * @returns 是否删除成功
         */
        removeItem: (id: string): boolean => {
            const { schema } = get();
            if (!schema) return false;

            // 不能删除根节点
            if (id === schema.id) return false;

            let success = false;
            set((state) => {
                if (!state.schema) return;
                // 通过通用工具函数删除指定节点
                success = removeNodeById(id, state.schema);
            });

            return success;
        },

        /**
         * 更新指定ID的节点
         * @param id 要更新的节点id
         * @param updates 要更新的属性
         * @returns 是否更新成功
         */
        updateItem: (id: string, updates: Partial<ComponentNode>): boolean => {
            const { schema } = get();
            if (!schema) return false;

            let success = false;
            set((state) => {
                if (!state.schema) return;
                // 通过通用工具函数更新指定节点
                success = updateNodeById(id, state.schema!, updates);
            });

            return success;
        }

    })
))