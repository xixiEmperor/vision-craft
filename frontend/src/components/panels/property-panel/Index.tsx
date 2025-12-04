import { useEffect, useMemo } from "react";
import FormRender, { useForm } from "form-render";
import type { ComponentNode, TextComponent } from "@/core/schema/basic";
import type { PageDSL } from "@/core/schema/page";
import { useSchemaStore } from "@/store/schema-store";
import { useShallow } from "zustand/shallow";
import { getTextPropsSchema } from "@/utils/formSchema";

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
    if (!selectedId || !schema) return null;
    return findItem(selectedId, schema) as ComponentNode | PageDSL | null;
  }, [selectedId, schema, findItem]);

  // Text 组件的 props 表单 schema，在运行时只生成一次
  const textPropsSchema = useMemo(() => getTextPropsSchema(), []);

  // 为 Text 组件创建 form-render 的 form 实例
  const textForm = useForm();

  // 当选中的节点变化且为 Text 组件时，将节点的 props 同步到表单初始值
  useEffect(() => {
    if (selectedNode && (selectedNode as ComponentNode).type === "Text") {
      const textNode = selectedNode as TextComponent;
      textForm.setValues(textNode.props);
    }
  }, [selectedNode, textForm]);

  // 未选中任何组件时的占位
  if (!selectedNode) {
    return <div>请选择一个组件查看配置</div>;
  }

  // 根节点暂时不展示可编辑表单
  if ((selectedNode as PageDSL).type === "RootContainer") {
    return <div>请选择画布中的组件进行配置</div>;
  }

  // Text 组件：使用 form-render + 动态生成的 JSON Schema 渲染配置表单
  if (selectedNode.type === "Text") {
    const textNode = selectedNode as TextComponent;

    return (
      <div>
        {/* Text 组件的自动化配置表单（基于 JSON Schema + form-render） */}
        <FormRender
          form={textForm}
          schema={textPropsSchema}
          // 使用 onValuesChange，而不是 onChange，符合 form-render v2 的官方用法
          onValuesChange={(_, formData) => {
            if (!selectedId) return;
            // 将表单结果写回全局 schema store，对应当前选中的组件
            updateItem(selectedId, {
              props: formData,
            } as Partial<ComponentNode>);
          }}
        />
      </div>
    );
  }

  // 其他还未接入 schema 的组件，先保持原始 JSON 展示，方便调试
  return (
    <div style={{ whiteSpace: "pre" }}>
      {JSON.stringify(selectedNode, null, 2)}
    </div>
  );
}

