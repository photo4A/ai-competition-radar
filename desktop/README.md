# 赛讯 Radar 桌面端

独立桌面窗口，快捷打开线上站点：  
https://workspace-beta-sand-54.vercel.app

## Windows 最快用法（推荐）

### 方式 A：双击打开网站（不用装依赖）

1. 从 GitHub 下载/克隆本仓库  
2. 打开文件夹 `desktop`  
3. 双击 **`赛讯Radar.url`** 或 **`open-radar.bat`**

可以把 `.url` / `.bat` 发送到桌面当快捷方式。

### 方式 B：Electron 桌面窗口

先进入**项目根目录**（不要在 `C:\Windows\System32`）：

```powershell
# 1) 克隆（只需一次）
cd $HOME\Desktop
git clone https://github.com/photo4A/ai-competition-radar.git
cd ai-competition-radar

# 2) 安装并启动桌面端
npm run desktop:install
npm run desktop
```

如果仓库已经在本机，只要：

```powershell
cd 你的路径\ai-competition-radar
npm run desktop:install
npm run desktop
```

## macOS / Linux

```bash
npm run desktop:install
npm run desktop
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
