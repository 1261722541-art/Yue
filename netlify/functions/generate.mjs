const allowedGoals = ['认知增长','新品上市','获客转化','品牌焕新','用户留存'];
const clamp = (v, n=400) => String(v ?? '').trim().slice(0,n);
const safeJson = (s) => { try { return JSON.parse(s); } catch { return null; } };
const system = `你是品牌整合营销策略顾问。请基于用户提供的Brief，用中文输出可执行的整合营销方案。禁止虚构已发生的业绩、真实市场调研数据、实际KOL报价、真实转化率。任何用户洞察都应标为“待验证假设”，任何效果预测标为“情景测算”。预算总和必须与Brief预算一致，给出清晰假设。内容创意具体，避免套话。只输出符合JSON格式的对象，不要Markdown代码围栏。JSON字段：summary (字符串), insights (3个对象数组，每项含 insight, evidenceNeeded, idea), bigIdea (对象，含 name, tagline, rationale), race (4个对象数组，含 stage, goal, tactics [2-3字符串], kpi), channels (数组，每项含 channel, angle, format, hook, cta), creators (对象，含 strategy, tiers [字符串]), calendar (4个对象数组，含 week, theme, actions [字符串]), tests (2个对象数组，含 hypothesis, variants, metric), risks (3个字符串), assumptions (3个字符串), budget (数组，每项含 channel, amount 数字), kpis (3个对象数组，含 name, target, formula)。所有字段必须存在。预算为人民币整数，budget amount合计等于输入预算。`;
export default async (request) => {
  if (request.method !== 'POST') return new Response(JSON.stringify({error:'仅支持 POST'}),{status:405,headers:{'content-type':'application/json'}});
  const key = process.env.OPENAI_API_KEY;
  if (!key) return new Response(JSON.stringify({error:'尚未配置 OPENAI_API_KEY。请在 Netlify 的环境变量中添加密钥，然后重新部署。',code:'NO_KEY'}),{status:503,headers:{'content-type':'application/json'}});
  let body; try { body = await request.json(); } catch { return new Response(JSON.stringify({error:'请求格式错误'}),{status:400}); }
  const brief = {
    brand:clamp(body.brand,100), industry:clamp(body.industry,80), product:clamp(body.product,500),
    audience:clamp(body.audience,400), goal:allowedGoals.includes(body.goal)?body.goal:'认知增长',
    channels:Array.isArray(body.channels)?body.channels.slice(0,8).map(x=>clamp(x,40)):[],
    budget:Math.round(Number(body.budget)), duration:clamp(body.duration,40), tone:clamp(body.tone,80), constraints:clamp(body.constraints,400)
  };
  if (!brief.brand || !brief.product || !brief.audience || !Number.isFinite(brief.budget) || brief.budget < 1000 || brief.budget > 100000000 || !brief.channels.length) return new Response(JSON.stringify({error:'请填写品牌、卖点、受众、至少一个渠道，以及有效预算（1,000—100,000,000 元）。'}),{status:400,headers:{'content-type':'application/json'}});
  const endpoint = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/,'');
  const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
  try {
    const controller = new AbortController(); const timer=setTimeout(()=>controller.abort(),55000);
    const upstream=await fetch(`${endpoint}/chat/completions`,{method:'POST',signal:controller.signal,headers:{'content-type':'application/json',authorization:`Bearer ${key}`},body:JSON.stringify({model,temperature:0.7,response_format:{type:'json_object'},messages:[{role:'system',content:system},{role:'user',content:JSON.stringify(brief)}]})});
    clearTimeout(timer);
    const data=await upstream.json().catch(()=>({}));
    if(!upstream.ok) return new Response(JSON.stringify({error:`模型服务返回错误（${upstream.status}）：${clamp(data.error?.message||'请检查 API 配置',180)}`}),{status:502,headers:{'content-type':'application/json'}});
    const raw=data.choices?.[0]?.message?.content;
    const result=typeof raw==='string'?safeJson(raw):null;
    if(!result || !result.summary || !Array.isArray(result.race)) throw Error('AI 返回的数据结构不完整，请重试');
    return new Response(JSON.stringify({result,model}),{headers:{'content-type':'application/json','cache-control':'no-store'}});
  }catch(err){return new Response(JSON.stringify({error:err.name==='AbortError'?'生成超时，请稍后重试':clamp(err.message||'生成失败',180)}),{status:502,headers:{'content-type':'application/json'}});}
};
