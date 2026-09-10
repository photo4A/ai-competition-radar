# 赛讯 Radar · AI 比赛雷达（网页版）

网页端 AI 比赛雷达：打开浏览器即可盯盘，**每分钟自动检查** aivs.one / Devpost 是否有新赛。

## 线上地址（已部署）

**立即打开：** [https://temporary-quick-granite-f5zu2ma.vercel.app](https://temporary-quick-granite-f5zu2ma.vercel.app)

> 这是我刚帮你部署的公网站点。关掉 Cursor 也能打开。  
> **请在 60 分钟内点下面链接认领**，否则临时部署会过期：  
> **[认领到你的 Vercel 账号（永久保留）](https://vercel.com/claim-deployment?code=ee591aaf-c69b-4d08-ad78-c90639c0a364)**

认领后站点会挂到你的 Vercel 名下，之后长期可用。

仓库：https://github.com/photo4A/ai-competition-radar

---

## 本地开发

必须带端口，否则会 `ERR_CONNECTION_REFUSED`：

**[http://127.0.0.1:43127](http://127.0.0.1:43127)**

```bash
npm install
npm run dev      # 开发
npm run serve    # 生产模式
npm run ensure   # 检测并拉起
npm run deploy   # 部署到自己的 Vercel
```

## 功能

- 网页实时检查：状态条倒计时 +「马上查一次」
- 封面卡片网格：奖励 / 截止日
- 报名中、7 天内截止、今日新增
- 筛选 / 搜索 / 本地新增标记
- 盯盘网址清单

## 技术栈

Next.js · TypeScript · Tailwind CSS · shadcn/ui
