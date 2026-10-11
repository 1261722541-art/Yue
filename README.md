# BrandPilot V16｜Tavily + OpenRouter 免费双模型版

任意品牌输入，Tavily 搜索并列出真实网页链接；OpenRouter 将搜索摘录总结为品牌研究，并生成整合营销策略。研究仅使用搜索摘要，不代表已完整阅读网页。

## Netlify 环境变量：仅需三个

| 名称 | Production 值 |
| --- | --- |
| `TAVILY_API_KEY` | Tavily API Key |
| `OPENROUTER_API_KEY` | OpenRouter API Key |
| `OPENROUTER_MODEL` | `nvidia/nemotron-3-super-120b-a12b:free` |

默认主模型由 `OPENROUTER_MODEL` 指定，建议使用 NVIDIA Nemotron 3 Super Free。主模型遇到 404、429、5xx、空正文、超时等可恢复错误，且仍有时间预算时，自动尝试一次 `apodex/apodex-1.1-mini:free`；**备用模型也占用免费调用额度**。如果主模型返回不符合 JSON 的内容，当前版本仍可能无法生成策略；不会伪造内容。账户须具备对应免费端点的访问权限。

不需要 `BASE_URL`，也不需要 Gemini/OpenAI 的环境变量。

## 文本与导出

网页里的品牌研究会把 `#` 标题、`**` 加粗和项目符号显示成正常排版；点击「复制方案」得到无 Markdown 标记的纯文本。「导出 Markdown」按钮保留标准 Markdown 格式（`.md`），方便进一步编辑；「打印 / PDF」保留网页排版。

## GitHub → Netlify 更新

解压并将 `public/index.html`、`netlify/functions/generate.mjs`、`README.md` 和 `netlify.toml` 以相同路径覆盖到现有 GitHub 仓库的 main 分支，Commit changes，等待 Netlify 自动部署。然后设置上述三个 Netlify 环境变量，Functions scope 必须可用，改变量后需要重新部署。打开 `https://你的域名/.netlify/functions/generate`，确认 `version` 为 `BrandPilot OpenRouter V16`，`modelFromNetlify` 为主模型 ID。

## 限制

静态语法和模拟请求测试不等于真实账号端到端测试；免费路由可能限速、停用或输出受限，Tavily 也有其独立额度。无完整的公开访问限速/账号验证，不建议随意公开给陌生人使用。
