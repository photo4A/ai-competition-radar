# 赛讯 Radar · AI 比赛雷达（网页版）

网页端 AI 比赛雷达：打开浏览器即可盯盘，**每分钟自动检查** aivs.one / Devpost 是否有新赛。

## 线上地址（已同步最新）

**立即打开：** [https://temporary-rushing-harp-u6j5h0l.vercel.app](https://temporary-rushing-harp-u6j5h0l.vercel.app)

> 已去掉「已部署 · 关掉 Cursor 也能打开」提示。  
> **请在 60 分钟内认领**（覆盖/替换旧站点）：  
> **[认领到你的 Vercel 账号](https://vercel.com/claim-deployment?code=c6a53513-05b9-4f04-9caf-5085db9d759b)**

若你已有认领过的正式站点：到 [Vercel Dashboard](https://vercel.com/dashboard) → 该项目 → **Redeploy** 最新 Production；或把 GitHub 仓库连上 Vercel 后会自动同步。

仓库：https://github.com/photo4A/ai-competition-radar

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/photo4A/ai-competition-radar)

---

## 本地开发

**[http://127.0.0.1:43127](http://127.0.0.1:43127)**

```bash
npm install
npm run dev
npm run serve
npm run ensure
npm run deploy
```

## 功能

- 网页实时检查：状态条倒计时 +「马上查一次」
- 封面卡片网格：奖励 / 截止日
- 报名中、7 天内截止、今日新增
- 筛选 / 搜索 / 本地新增标记
- 盯盘网址清单

## 技术栈

Next.js · TypeScript · Tailwind CSS · shadcn/ui
