import { textDefaultConfig } from "./text.config";
import { containerDefaultConfig } from "./container.config";
import { smartDeepClone } from "@/utils/deepClone";

/**
 * 组件默认配置映射
 */
export const componentDefaultConfigs = {
  Text: textDefaultConfig,
  Container: containerDefaultConfig
};

export const getTextPropsConfig = (type: keyof typeof componentDefaultConfigs) => {
 // 根据type 获取对应的默认配置
  return smartDeepClone(componentDefaultConfigs[type]);
}


