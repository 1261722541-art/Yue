# BrandPilot V14 · Tavily 搜索 + OpenRouter 免费模型

这版基于 V10 Clean / V12 的原页面改造。支持输入任何品牌（Nike / Apple / 瑞幸等），Tavily 提供真实网页来源，OpenRouter 负责生成品牌研究和整合营销策略。保留来源展示、Markdown 导出与打印/PDF。

## Netlify 环境变量：仅需 3 个

| Key | Production Value | 获取地址 |
|---|---|---|
| `TAVILY_API_KEY` | 你的 Tavily API Key | https://app.tavily.com/ |
| `OPENROUTER_API_KEY` | 你的 OpenRouter API Key | https://openrouter.ai/settings/keys |
| `OPENROUTER_MODEL` | `apodex/apodex-1.1-mini:free` | https://openrouter.ai/apodex/apodex-1.1-mini:free |

密钥设为 Secret，确保 Scope 包含 Functions。无需 `BASE_URL`。**可删除旧的 `GEMINI_*` 和 `OPENAI_*` 环境变量；代码完全不读取它们。**

## 部署

1. 解压 ZIP，保持 `public/index.html`、`netlify/functions/generate.mjs`、`netlify.toml` 的相对路径。
2. 覆盖到已经链接 Netlify 的 GitHub 仓库 `main` 分支（不要上传 ZIP 本身），点击 Commit changes。
3. 检查 Netlify Deploys 是否 Published，并部署了 `generate` Function。
4. 配置/核对上述三个变量，必要时重新部署。
5. 访问 `https://你的域名/.netlify/functions/generate`，应该显示 `BrandPilot OpenRouter V14`，`modelFromNetlify` 是 `apodex/apodex-1.1-mini:free`，两个 Key configured 为 true（不会泄露 Key）。
6. 输入品牌并生成。研究阶段需要联网搜索；模型处理搜索摘录，不代表已阅读全文。

## 错误提示与限制

- 401：密钥无效；403：账户或提供商限制；404：模型不存在/不可用；429：免费额度或频率超限；5xx：模型提供商暂时故障。
- **免费模型可能不支持强制 JSON 格式。** 后端采用自然语言提示要求 JSON，并校验输出结构；若模型不遵守格式，会提示重新生成，不会伪造方案。
- OpenRouter 免费模型会有调用限制，OpenRouter 账户的 closed-weight 模型限制并不意味着开源免费模型一定可用，须用密钥实际测试。
- 代码通过静态语法检查和本地模拟测试，不代表用户账户、模型与在线 Netlify 环境已端到端通过。
- 公开网站没有验证码/用户授权和复杂速率限制，不建议广泛公开。

## V14 的 length 修复

- `finish_reason: length` 且正文为空：尝试一次受控重试（仅在剩余时间允许时），不会无限请求。
- OpenRouter 调用默认 `reasoning.effort=low`，对支持该参数的推理模型降低思考消耗；如果提供商不支持，可能忽略此设置。
- 研究输出上限调整到 5,200 Token；策略输出上限调整到 9,000 Token，且要求紧凑 JSON。
- 仍然受免费模型输出限制及 Netlify Function 超时限制，不能保证每次生成成功。
- 仍然只需要 `TAVILY_API_KEY`、`OPENROUTER_API_KEY`、`OPENROUTER_MODEL` 三个变量，且仍支持任意品牌输入。
