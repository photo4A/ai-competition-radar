# 赛讯 Radar · AI 比赛雷达（网页版）

网页端 AI 比赛雷达：打开浏览器即可盯盘，**每分钟自动检查** aivs.one / Devpost 是否有新赛。

## 线上地址（已部署到你的 Vercel）

**正式站点：** [https://workspace-beta-sand-54.vercel.app](https://workspace-beta-sand-54.vercel.app)

关掉 Cursor 也能打开。之后更新代码可在本机运行：

```bash
npm run deploy
```

仓库：https://github.com/photo4A/ai-competition-radar

## 桌面 App（快捷入口）

独立窗口打开线上站点，不用每次找浏览器标签：

```bash
npm run desktop:install
npm run desktop
```

详情见 `desktop/README.md`。

---

## 本地开发

**[http://127.0.0.1:43127](http://127.0.0.1:43127)**

```bash
npm install
npm run dev
npm run serve
npm run ensure
```

## 功能

- 网页实时检查：状态条倒计时 +「马上查一次」
- 状态筛选含「刚发布」（近 3 天新上线）
- 封面卡片网格：奖励 / 截止日
- 报名中、7 天内截止、今日新增
- 筛选 / 搜索 / 本地新增标记
- 盯盘网址清单

## 技术栈

Next.js · TypeScript · Tailwind CSS · shadcn/ui
