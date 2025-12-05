import { useMemo, useEffect, useState } from "react";
import { Select, Input, InputNumber, Button, Typography } from "antd";
import { useSchemaStore } from "@/store/schema-store";
import { useShallow } from "zustand/shallow";
import type { WidgetProps } from "form-render";

const { TextArea } = Input;
const { Text } = Typography;

/**
 * 数据源配置自定义组件
 * - 统一编辑 BaseChartComponent 中的 dataSource 字段
 * - value/onChange 规范遵守 form-render 的自定义 widget 标准
 */
export default function DataSourceConfigWidget(props: WidgetProps) {
  const { onChange, value, addons } = props;
  // 从 store 获取当前选中组件的 dataSource 作为兜底初始值
  const { selectedId, schema, findItem } = useSchemaStore(
    useShallow((state) => ({
      selectedId: state.selectedId,
      schema: state.schema,
      findItem: state.findItem,
    })),
  );
  const storeDataSource = useMemo(() => {
    if (!selectedId || !schema) return undefined;
    const node = findItem(selectedId, schema);
    if (!node || (node as any).type === "RootContainer") return undefined;
    return (node as any).props?.dataSource;
  }, [selectedId, schema, findItem]);

  // 以表单态值优先，兜底使用 store 值，避免初始为空
  const latestFormValue =
    value ??
    addons?.getValueByPath?.(addons.dataPath) ??
    storeDataSource ??
    undefined;
  // 兜底数据源结构，避免 value 为空导致读取错误
  const innerValue = useMemo(
    () => ({
      sourceType: "static",
      data: [],
      apiUrl: "",
      refreshInterval: undefined,
      ...(latestFormValue || {}),
    }),
    [latestFormValue],
  );

  // 将静态数据序列化为文本，便于用户直接编辑
  const [staticText, setStaticText] = useState(() =>
    JSON.stringify(innerValue.data ?? [], null, 2),
  );
  const [parseError, setParseError] = useState<string | null>(null);

  // 外部 value 变更时同步文本框内容
  useEffect(() => {
    setStaticText(JSON.stringify(innerValue.data ?? [], null, 2));
  }, [innerValue.data]);

  const applyChange = (next: Partial<typeof innerValue>) => {
    const merged = {
      ...innerValue,
      ...next,
    };
    // 双通道同步，避免偶发的 value 未更新问题
    onChange?.(merged);
    addons?.setValueByPath?.(addons.dataPath, merged);
  };

  const handleSourceTypeChange = (nextType: string) => {
    setParseError(null);
    applyChange({ sourceType: nextType });
  };

  const handleStaticBlur = () => {
    try {
      // 尝试将用户输入解析为 JSON 数组
      const parsed = JSON.parse(staticText || "[]");
      setParseError(null);
      applyChange({ sourceType: "static", data: parsed });
    } catch {
      // 解析失败时提示用户，但不覆盖原有数据
      setParseError("请输入有效的 JSON 数组");
    }
  };

  const handleUseTemplate = () => {
    const template = [
      { name: "示例 A", value: 120 },
      { name: "示例 B", value: 200 },
      { name: "示例 C", value: 150 },
    ];
    const text = JSON.stringify(template, null, 2);
    setStaticText(text);
    setParseError(null);
    applyChange({ sourceType: "static", data: template });
  };

  const handleApiUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    applyChange({ sourceType: "api", apiUrl: e.target.value });
  };

  const handleRefreshChange = (v: number | null) => {
    applyChange({ sourceType: "api", refreshInterval: v ?? undefined });
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {/* 数据源类型选择 */}
      <div className="flex flex-col gap-1">
        <span>数据源类型</span>
        <Select
          size="small"
          value={innerValue.sourceType || "static"}
          onChange={handleSourceTypeChange}
          options={[
            { label: "静态数据", value: "static" },
            { label: "接口数据（预留）", value: "api" },
          ]}
        />
      </div>

      {/* 静态数据 JSON 编辑区 */}
      {innerValue.sourceType === "static" && (
        <div className="flex flex-col gap-1">
          <span>静态数据（JSON 数组）</span>
          <TextArea
            rows={4}
            value={staticText}
            onChange={(e) => setStaticText(e.target.value)}
            onBlur={handleStaticBlur}
            placeholder='例如：[{"name":"A","value":120}]'
          />
          <div className="flex items-center justify-between">
            <Button size="small" onClick={handleUseTemplate}>
              填充示例数据
            </Button>
            {parseError ? (
              <Text type="danger">{parseError}</Text>
            ) : (
              <Text type="secondary">支持直接粘贴数组或对象列表</Text>
            )}
          </div>
        </div>
      )}

      {/* API 数据配置区域 */}
      {innerValue.sourceType === "api" && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <span>接口地址</span>
            <Input
              size="small"
              placeholder="https://api.example.com/chart"
              value={innerValue.apiUrl ?? ""}
              onChange={handleApiUrlChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <span>刷新间隔（秒，可选）</span>
            <InputNumber
              size="small"
              style={{ width: "100%" }}
              min={0}
              placeholder="留空则不自动刷新"
              value={innerValue.refreshInterval}
              onChange={handleRefreshChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}


