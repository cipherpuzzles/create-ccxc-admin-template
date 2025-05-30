# Create CCXC Admin Template

一个用于快速创建 CCXC Engine 系统插件项目的交互式工具。通过简单的命令行交互，您可以快速生成包含前后端完整功能的插件项目。

## 快速开始

### 使用 npm create（推荐）

```bash
# 直接创建新的插件项目
npm create ccxc-admin-template my-plugin

# 或者不指定名称，工具会提示输入
npm create ccxc-admin-template
```

这个命令会：
1. 🎯 交互式收集您的插件配置信息
2. 📦 自动创建项目目录和所有必要文件
3. 🔧 配置后端项目的命名空间和入口类
4. ✨ 生成前端组件（如果需要）
5. 📋 提供清晰的后续步骤指导

### 本地开发和测试

如果您想在本地开发和测试这个工具：

```bash
# 克隆项目
git clone https://github.com/yourusername/create-ccxc-admin-template.git
cd create-ccxc-admin-template

# 安装依赖
npm install

# 本地测试
npm run test
```

## 生成的项目特性

通过 `npm create ccxc-admin-template` 生成的项目包含：

### 技术栈
- **后端**：C# (.NET 8.0)
- **前端**：Vue 3 + Ant Design Vue  
- **构建工具**：Vite + Node.js

### 项目结构
```
my-plugin/
├── manifest.json                     # 插件配置文件
├── package.json                      # Node.js 项目配置
├── [您的后端项目名]/                   # 后端项目目录
│   ├── [项目名].csproj               # C# 项目文件
│   ├── [入口类名].cs                 # 插件入口类
│   └── Controllers/                  # API 控制器
└── src/views/                        # 前端组件（可选）
    └── [组件名].vue                  # Vue 组件
```

### 自动化配置
- ✅ 自动生成符合规范的 `manifest.json`
- ✅ 重命名后端项目目录和文件
- ✅ 更新所有 C# 文件的命名空间
- ✅ 生成正确的程序集名称和入口类路径
- ✅ 创建前端组件文件（如果需要）
- ✅ 复制所有必要的配置和构建文件

## 交互式配置

工具会引导您完成以下配置：

### 1. 插件基本信息
- 插件名称（建议使用反向域名格式）
- 插件标题和描述
- 版本号和作者信息

### 2. 后端项目配置  
- 后端项目名称（将作为 C# 命名空间）
- 入口类名称

### 3. 前端扩展（可选）
- 是否需要前端管理面板
- 面板名称、路径和组件名称

## 生成后的使用流程

创建项目后的标准工作流程：

```bash
# 1. 进入项目目录
cd my-plugin

# 2. 安装依赖
npm install

# 3. 开发您的插件功能
# - 编辑后端 C# 代码
# - 编辑前端 Vue 组件（如果有）

# 4. 构建项目
npm run build

# 5. 部署到 CCXC 系统
# - 将 dist/frontend 复制到 ccxc-admin/plugins/
# - 将 dist/backend 复制到 ccxc-backend/Plugins/
```


## 技术支持

- 插件开发规范请参考 CCXC Engine 官方文档
- 前端组件开发请参考 [Ant Design Vue](https://antdv.com/) 文档
- 如遇问题，请检查生成的项目中的 README 文件

## 许可证

MIT License
