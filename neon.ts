import { defineConfig } from "@neon/config/v1";

// 空配置：不声明任何 Neon 服务，也不做分支策略覆盖，全部沿用项目默认设置。
// 后续需要 Auth / 对象存储 / Functions 等能力时，在此声明并重新执行 `neon deploy`。
export default defineConfig({});
