# BrandPilot V20 — 品牌专属短方案版

基于 V19 重构。前端不再显示任何固定行业模板、英文研究摘要或来源链接。Tavily 在服务器侧检索真实资料，OpenRouter 根据用户输入品牌、目标及渠道生成简短中文内容。每个勾选渠道必须在模型响应中出现，否则提示失败；不把模板冒充品牌研究。

## Netlify 环境变量
- `TAVILY_API_KEY`：Tavily 搜索密钥
- `OPENROUTER_API_KEY`：OpenRouter 密钥
- `OPENROUTER_MODEL`：可生成中文文本的 OpenRouter 模型 ID（例如 `nvidia/nemotron-3-super-120b-a12b:free`）

发布时把项目文件更新到 GitHub 根目录；Netlify 需要使用 netlify.toml 并部署 netlify/functions/generate.mjs。

注意：第三方免费模型可能超时或无法返回品牌定制内容。本版只在 AI 成功返回时呈现“品牌专属策略”，不承诺免费 API 的服务可用性。预算分配为示例测算，不是报价。


## V21 缺失渠道修复
AI 策略即使漏掉一个渠道也会先显示并允许复制；网页随后单独请求补写缺失渠道。补写失败不会抹掉已有方案。
