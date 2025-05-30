# CCXC Admin 插件项目

这是一个由 `create-ccxc-admin-template` 生成的 CCXC Engine 插件项目。

## 项目简介

本插件项目为 CCXC Engine 提供了完整的前后端扩展能力：

- **后端 API 扩展**：为 CCXC Engine 后端提供额外的 API 接口和业务逻辑
- **前端管理面板扩展**：为 CCXC Admin 后台管理系统添加新的管理页面和功能模块

## 技术栈

- **后端**：C# (.NET 8.0)
- **前端**：Vue 3 + Ant Design Vue
- **构建工具**：Vite + Node.js

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发

在开发过程中，您可以使用以下命令：

```bash
# 启动开发服务器（仅前端）
npm run dev
```

## 构建

### 完整构建

构建前端和后端：

```bash
npm run build
```

### 分别构建

```bash
# 仅构建前端
npm run build:f

# 仅构建后端
npm run build:b
```

构建完成后，输出文件将生成在 `dist` 目录下：
- `dist/frontend/` - 前端构建产物
- `dist/backend/` - 后端构建产物

## 部署

构建完成后，需要将构建产物部署到对应的 CCXC 系统目录：

### 1. 部署前端

将 `dist/frontend` 目录复制到 `ccxc-admin` 发布目录下的 `plugins` 目录：

```
ccxc-admin/
├── plugins/
│   └── [您的插件名称]/  <- 复制 dist/frontend 内容到这里
```

### 2. 部署后端

将 `dist/backend` 目录复制到 `ccxc-backend` 目录下的 `Plugins` 目录：

```
ccxc-backend/
├── Plugins/
│   └── [您的插件名称]/  <- 复制 dist/backend 内容到这里
```

## 配置说明

### manifest.json

插件的核心配置文件，包含：

- **name**: 插件唯一标识符（建议使用反向域名格式）
- **title**: 插件显示名称
- **description**: 插件描述
- **entry_assembly**: 后端程序集名称
- **entry**: 插件入口类完整路径
- **icon**: 插件图标（Ant Design 图标名称）
- **frontendComponents**: 前端组件配置（如果有）

### 图标配置

所有图标字段使用 Ant Design 图标名称，例如：
- `UserOutlined`
- `SettingOutlined`
- `DatabaseOutlined`

完整图标列表：[Ant Design Icons](https://ant.design/components/icon)

## 开发指南

### 后端开发

1. 在您的项目目录中实现业务逻辑
2. 添加控制器到 `Controllers` 目录
3. 实现 `IPlugin` 接口的相关方法

### 前端开发

1. 在 `src/views` 目录中创建您的组件
2. 使用 Ant Design Vue 组件构建用户界面
3. 通过 `inject('request')` 调用后端 API

## 注意事项

1. 确保您的插件名称在整个 CCXC 系统中是唯一的
2. 前端组件需要与 CCXC Admin 的设计规范保持一致
3. 后端 API 需要遵循 CCXC Engine 的安全和权限规范
4. 在生产环境部署前，请充分测试您的插件功能

## 许可证

请遵循您的组织或项目的许可证要求。 