# 赛讯 Radar 桌面端

独立桌面窗口，快捷打开线上站点：  
https://workspace-beta-sand-54.vercel.app

## 启动

在仓库根目录：

```bash
npm run desktop:install
npm run desktop
```

或进入本目录：

```bash
cd desktop
npm install
npm start
```

## 换地址

```bash
RADAR_URL=https://你的域名.vercel.app npm start
```

## 打包成安装包（可选）

```bash
cd desktop
npm run dist
```

产物在 `desktop/release/`。
