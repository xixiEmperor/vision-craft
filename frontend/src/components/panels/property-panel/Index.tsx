import { useMemo } from "react";
import FormRender, { useForm } from "form-render";
import type { ComponentNode } from "@/core/schema/basic";
import type { PageDSL } from "@/core/schema/page";
import { useSchemaStore } from "@/store/schema-store";
import { useShallow } from "zustand/shallow";
import { componentDefaultConfigs } from "@/config";
import { getComponentPropsSchema } from "@/utils/formSchema";

export default function PropertyPanel() {
  const { selectedId, findItem, schema, updateItem } = useSchemaStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      findItem: state.findItem,
      schema: state.schema as PageDSL | null,
      updateItem: state.updateItem,
    })),
  );

  // 根据当前选中的组件 id，获取对应的节点数据
  const selectedNode = useMemo<ComponentNode | PageDSL | null>(() => {
    if (!selectedId || !schema) {
      return null;
    }
    return findItem(selectedId, schema) as ComponentNode | PageDSL | null;
  }, [selectedId, schema, findItem]);

  // 当前选中组件的 props 配置表单 schema（Text、Clock 等共用一套生成逻辑）
  const componentPropsSchema = useMemo(() => {
    // 没选就不管
    if (!selectedNode) {
      return null;
    }
    // 选的是根容器，也不管
    if ((selectedNode as PageDSL).type === "RootContainer") {
      return null;
    }

    const node = selectedNode as ComponentNode;
    const defaultConfig = componentDefaultConfigs[node.type as keyof typeof componentDefaultConfigs];

    if (!defaultConfig) {
      return null;
    }

    return getComponentPropsSchema(node.type, defaultConfig.props);
  }, [selectedNode]);

  // 为属性表单创建 form-render 的 form 实例
  const form = useForm();

  // 未选中任何组件时的占位
  if (!selectedNode) {
    return <div>请选择一个组件查看配置</div>;
  }

  // 根节点暂时不展示可编辑表单
  if ((selectedNode as PageDSL).type === "RootContainer") {
    return <div>请选择画布中的组件进行配置</div>;
  }

  if (componentPropsSchema) {
    return (
        <FormRender
          className="flex flex-col justify-between items-center p-2 h-full overflow-y-scroll"
          form={form}
          schema={componentPropsSchema}
          footer={true}
          onMount={() => {
            form.setValues((selectedNode as ComponentNode).props);
          }}
          onFinish={(values) => {
            if (!selectedId) return;
            updateItem(selectedId, {
              props: values,
            } as Partial<ComponentNode>);
          }}
        />
    );
  }

  // 其他还未接入 schema 的组件，先保持原始 JSON 展示，方便调试
  return (
    <div style={{ whiteSpace: "pre" }}>
      {JSON.stringify(selectedNode, null, 2)}
    </div>
  );
}

