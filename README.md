# BrandPilot V19｜策略优先版

## 功能
- 任意品牌、目标、预算和传播渠道
- Tavily 搜索真实品牌资料，附可点击的网页来源
- OpenRouter 直接生成 **AI Campaign Proposal**（核心洞察、Big Idea、全部选中渠道玩法、RACE、4 周节奏）
- 规则引擎独立计算预算、KPI、达人组合及执行框架。AI 失败时仍可导出规则草案，**但不会冒充 AI 策略**。
- AI 输出采用自由文本而非复杂严格 JSON，减少免费推理模型因截断或格式校验失败而整段丢弃的问题。

## Netlify 环境变量（仅三个）
- `TAVILY_API_KEY`：Tavily 密钥
- `OPENROUTER_API_KEY`：OpenRouter 密钥
- `OPENROUTER_MODEL`：例如 `nvidia/nemotron-3-super-120b-a12b:free`

### 部署
将根目录 `public/`、`netlify/functions/`、`netlify.toml` 和 `README.md` 上传 GitHub 仓库根目录，提交后 Netlify 构建部署。不要将密钥放在 GitHub。
访问 `/.netlify/functions/generate` 查看实际版本与配置（不显示密钥）。

### 限制
API 免费模型可能超时、空输出或临时不可用，版本不保证每次成功。若策略请求失败，页面会明确显示失败，并保留规则版基础方案；规则版不等于 AI 品牌定制方案。
联网研究来源是第三方网页摘录，并不保证所有内容准确；策略建议、KPI 与预算需要人工审核。


V19 调整：主模型最长等待约40秒、备用最长17秒、网页等待上限105秒；品牌研究仅展示简明中文状态及来源；模板洞察改为具体场景与行为策略建议。实际等待仍受 Netlify 平台函数时限约束。
