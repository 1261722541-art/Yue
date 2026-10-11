# BrandPilot V10 精简修复版

用途：联网搜索品牌资料，再生成中文整合营销方案。保留原页面、来源、Markdown 导出和打印功能。

## 文件
- public/index.html：网页。
- netlify/functions/generate.mjs：联网搜索和 AI 后端。
- netlify.toml：部署配置。
- README.md：本说明。

## 需要配置的三个环境变量
在 Netlify 项目的 Environment variables 中添加，正式环境须有 Production 值，作用范围包含 Functions 或所有范围。

| 名称 | 内容 |
| --- | --- |
| GEMINI_API_KEY | Google AI Studio 的真实 API Key：https://aistudio.google.com/apikey |
| TAVILY_API_KEY | Tavily 的真实 API Key：https://app.tavily.com/ |
| GEMINI_MODEL | 你的账号可用、支持文字生成和 JSON 输出的 Gemini 模型 ID |

两个 Key 请设为 Secret。不要填进 HTML、仓库或聊天。无需 OPENAI_API_KEY、BASE_URL 或数据库。
不提供未经实际账号验证的默认模型。包含 tts/image/audio/live/embedding 的专用模型会被拦截；此检查不能代替实际权限和配额验证。

## 部署
1. 解压，将 public、netlify、netlify.toml 和 README.md 放在 GitHub 仓库根目录，勿额外套一层目录。
2. 在 Netlify 将该仓库连接到项目。
3. Base directory 和 Build command 留空；Publish directory 为 public。Functions 目录已由 netlify.toml 指定。
4. 添加三个环境变量，触发部署。修改变量后也需要重新部署。
5. 确认部署详情包含 generate 函数。仅拖拽 public 静态目录不足以部署此后端。
6. 打开 https://你的域名/.netlify/functions/generate，应显示 version 为 BrandPilot V10，modelFromNetlify 为配置的模型，两个 Key 的 Configured 状态为 true。
7. 配置状态只代表变量存在。最后输入 Nike 和 https://www.nike.com，实际验证搜索、来源、策略是否成功。

可选 CLI 路线（需要本机安装 Node.js，命令在解压目录运行）：
```
npx netlify-cli login
npx netlify-cli link
npx netlify-cli deploy --prod --dir=public --functions=netlify/functions
```
link 时选择要更新的已有站点，并先在该站点设置环境变量。

## 本版修改
- 删除重复 V6 说明、乱码文件名说明和旧模型列表推荐逻辑。
- 明确拒绝语音/图像等专用模型，不擅自换成另一个未验证的型号。
- 单次调研的搜索和生成超时上限调整为 12 秒与 40 秒；策略生成上限为 45 秒。
- 非 JSON/HTML 错误页显示可理解的提示，避免直接暴露 Unexpected token 错误。
- 研究完成立即显示；策略失败保留研究，点击重试无需再次搜索。修改 Brief 则重新研究。
- 对研究签名，一小时内允许重试，防止浏览器改写研究文本或挪用于其他 Brief。
- 校验主要输出字段、非空内容、预算整数与预算总额；无效方案报错，不作为成功展示。
- 修复 JSON null 请求崩溃，生成新方案时禁用旧结果导出。

## 验证与边界
已通过前后端语法检查及模拟接口测试：TTS 拦截、无效输入、完整生成流程、研究签名/篡改/Brief 不匹配检查、预算与结构校验。
未使用真实 API Key 完成联网端到端测试，也未在你的 Netlify 账号部署。
Google 503、额度不足和网络故障仍可能发生，不能保证每次生成成功；策略失败可手动重试。
每次完整生成通常使用两次 Tavily 搜索、两次 Gemini 生成；重试策略仍消耗 Gemini 额度。
搜索依据网页摘要，不是完整网页，也不是小红书或抖音内部数据库；引用与结论需人工核验。
当前没有登录、调用限流或云端历史记录；研究签名不等于访问控制，公开供多人使用前应增加调用限制。
