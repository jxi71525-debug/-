# 专注工作台 (Focus Workspace)

一款硬核且具有质感的自律专注 Web 应用。通过调用手机原生陀螺仪传感器实现“物理防摸鱼”，并内置深度游戏化的宠物养成系统与高质量动漫 Lofi 白噪音场景，用详尽的数据记录你的每一次成长。

🌍 **在线体验地址 (Public URL):** [https://delta-two-55.vercel.app/](https://delta-two-55.vercel.app/)

## 🚀 核心功能 (Features)

- **物理防摸鱼**: 调用 iOS/Android 设备传感器（DeviceOrientation API），专注期间一旦拿起手机立刻触发“破戒”警告并扣除宠物经验。
- **电子盆栽养成**: 伴随专注时长，你的专属宠物（猫、狗、鸟、龟、狐狸）将获取经验、升级，并具备离线饥饿度衰减机制。
- **Lofi 白噪音场景**: 内置 6 款高质感动漫风格场景（温馨书桌、海边列车等），并配有无缝循环的 Chillhop 沉浸式白噪音。
- **深度数据统计**: 支持无限自定义专注标签（自动哈希分配专属莫兰迪色），提供周趋势柱状图与朋友圈风格的垂直时间轴记录。
- **时间感知 UI**: 界面颜色与问候语会根据一天中的时间自动切换，并在深夜自动开启深色莫兰迪护眼模式。

---

## 🛠️ 技术栈 (Tech Stack)

- **框架**: React 18 + TypeScript + Vite
- **样式**: Tailwind CSS (自定义莫兰迪色系扩展)
- **图标**: Lucide React
- **状态管理**: Zustand (结合 LocalStorage 实现数据持久化)
- **部署**: Vercel

---

## 💻 本地运行指南 (How to Run Locally)

### 1. 前置环境要求 (Prerequisites)
请确保你的电脑已安装以下环境：
- [Node.js](https://nodejs.org/) (推荐 v18 或更高版本)
- [Git](https://git-scm.com/)

### 2. 克隆项目与安装依赖 (Setup)

在终端中执行以下命令：

```bash
# 1. 克隆项目到本地 (如果你还没克隆的话)
git clone https://github.com/jxi71525-debug/-.git
cd "-"

# 2. 安装项目所需的所有依赖包
npm install
```

### 3. 启动本地开发服务器 (Run)

```bash
# 启动开发服务器
npm run dev
```

启动成功后，终端会显示本地访问地址（通常是 `http://localhost:5173/`）。

> **💡 手机端测试提示 (Mobile Testing):**
> 陀螺仪防摸鱼功能**必须在手机上**才能体验。如果你想在同一局域网下的手机上测试，请运行 `npm run dev -- --host`，然后用手机浏览器访问终端中显示的 `Network` 地址（如 `http://192.168.x.x:5173`）。

### 4. 编译打包 (Build for Production)

如果你需要将代码编译为用于生产环境的静态文件：

```bash
npm run build
```
编译后的文件将生成在根目录的 `dist/` 文件夹中。

---

## 📄 依赖清单 (Key Dependencies)
- `react` & `react-dom`: 核心 UI 库
- `tailwindcss`: 核心样式库
- `zustand`: 全局状态与本地缓存管理
- `lucide-react`: 矢量图标库
- `date-fns`: (如果后续用到) 时间格式化辅助

---
*Designed & Developed with ❤️ for a more focused life.*