# BrandPilot AI — Campaign Copilot

这是一个**真实调用大模型的 AI 营销方案生成器**，不是仅输出 Prompt 的静态网页。

## 功能
- 输入品牌 Brief：品牌、受众、产品卖点、营销目标、预算、周期、渠道
- 调用大模型，生成 Big Idea、消费者洞察假设、RACE、渠道内容矩阵、KOL/KOC、4周排期、A/B 测试、风险检查
- 校验预算总额；导出 Markdown / 打印为 PDF
- API Key 仅保存在 Netlify 服务端环境变量，浏览器不接触密钥

## 最简单的部署方式：GitHub + Netlify
1. 解压本 ZIP，上传其中的 `public` 文件夹、`netlify` 文件夹和 `netlify.toml` 到一个新的 GitHub 仓库根目录。
2. 在 https://app.netlify.com 选择 **Add new project → Import an existing project → GitHub**，选择该仓库。
3. 部署设置：**Publish directory = `public`**，Functions directory 由 `netlify.toml` 自动指定。无需 build command。
4. 在 Netlify 项目 **Site configuration → Environment variables** 中添加：
   - `OPENAI_API_KEY` = 你的 API 密钥（必填）
   - `OPENAI_MODEL` = `gpt-4.1-mini`（可选，默认该值）
   - `OPENAI_BASE_URL` = `https://api.openai.com/v1`（可选）
5. **重新部署**，打开生成的 `*.netlify.app` 链接即可体验。

注意：**直接把 HTML 拖进 Netlify Drop 或双击本地 HTML，不会部署后端函数，因此无法调用 AI。** 必须部署完整项目。

## 本地运行（可选）
安装 Node.js 和 Netlify CLI，进入目录，配置 `.env`（不要提交到 GitHub），运行 `npx netlify dev`。

## 成本与安全
- 调用模型通常会产生 API 费用，需要自己的密钥及对应的计费权限。
- 请勿将 API Key 写入 HTML、公开仓库或聊天记录。
- 公开部署的站点允许访客发起 AI 调用，可能产生费用。求职展示时建议在 Netlify 设置访问保护，或增加鉴权与调用限额。当前原型**未内置访问鉴权、速率限制**，不适合无保护地长期公开使用。
- 模型输出是策略草案，市场洞察、KOL 价格、预算和 KPI 必须人工验证。

## 技术实现
- HTML / CSS / Vanilla JS
- Netlify Functions（Node.js）
- OpenAI-compatible Chat Completions API（服务器端调用）
- 无第三方前端依赖

## 作品集描述
使用 AI 辅助开发并实现 BrandPilot AI 营销策略工作台，围绕品牌 Brief 构建自动化工作流，通过大模型生成整合营销策略、RACE 框架、平台内容矩阵、KOL/KOC 合作建议及预算与 KPI 草案，并实现预算校验、方案导出和服务端密钥管理。强调 AI 辅助提效与人工审核机制。
