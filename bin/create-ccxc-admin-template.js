#!/usr/bin/env node

import fs from 'fs-extra';
import path from 'path';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templateDir = path.resolve(__dirname, '../template');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function updateFileContent(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [search, replace] of Object.entries(replacements)) {
        content = content.replace(new RegExp(search, 'g'), replace);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
}

async function main() {
    const args = process.argv.slice(2);
    const projectName = args[0] || await question('项目名称 (默认: my-ccxc-plugin): ') || 'my-ccxc-plugin';
    
    console.log('=== CCXC Admin 插件项目创建器 ===\n');
    console.log(`🚀 正在创建项目: ${projectName}\n`);
    
    const targetDir = path.resolve(process.cwd(), projectName);
    
    // 检查目标目录是否已存在
    if (fs.existsSync(targetDir)) {
        const overwrite = await question(`目录 ${projectName} 已存在，是否覆盖？(y/n): `);
        if (overwrite.toLowerCase() !== 'y' && overwrite.toLowerCase() !== 'yes') {
            console.log('操作已取消');
            rl.close();
            return;
        }
        fs.removeSync(targetDir);
    }
    
    // 创建项目目录
    fs.ensureDirSync(targetDir);
    
    // 收集基本信息
    console.log('请输入插件的基本信息：');
    const pluginName = await question('插件名称 (例如: com.yourcompany.ccxc-engine.YourPlugin): ');
    const pluginTitle = await question('插件标题: ');
    const pluginDescription = await question('插件描述: ');
    const pluginVersion = await question('插件版本 (默认: 1.0.0): ') || '1.0.0';
    const pluginAuthor = await question('作者名称: ');
    
    // 收集后端信息
    console.log('\n请输入后端项目信息：');
    const backendProjectName = await question('后端项目名称 (例如: Example): ') || 'PluginBackend';
    const entryClassName = await question('入口类名 (例如: AAAPlugin): ') || 'ExamplePlugin';
    
    // 询问是否需要前端扩展
    console.log('\n前端扩展配置：');
    const needFrontend = await question('是否需要前端面板扩展？(y/n): ');
    
    let frontendConfig = null;
    if (needFrontend.toLowerCase() === 'y' || needFrontend.toLowerCase() === 'yes') {
        frontendConfig = {
            name: await question('面板名称: ') || '测试面板',
            path: await question('路径 (例如: testPlugin): ') || 'testPlugin',
            component: await question('组件名称 (例如: testPanel): ') || 'testPanel'
        };
    }
    
    console.log('\n📦 正在复制模板文件...');
    
    // 复制模板目录到目标位置
    fs.copySync(templateDir, targetDir);
    
    console.log('✅ 模板文件复制完成');
    console.log('🔧 正在配置项目...');
    
    // 生成 manifest.json
    const manifest = {
        name: pluginName,
        title: pluginTitle,
        description: pluginDescription,
        version: pluginVersion,
        author: pluginAuthor,
        entry_assembly: `${backendProjectName}.dll`,
        entry: `${backendProjectName}.${entryClassName}`,
        icon: "InfoCircleOutlined",
        frontendComponents: frontendConfig ? [{
            name: frontendConfig.name,
            path: frontendConfig.path,
            component: frontendConfig.component,
            icon: "BarChartOutlined"
        }] : []
    };
    
    fs.writeFileSync(
        path.join(targetDir, 'manifest.json'),
        JSON.stringify(manifest, null, 4),
        'utf8'
    );
    
    // 重命名和配置后端项目
    const oldBackendDir = path.join(targetDir, 'PluginBackend');
    const newBackendDir = path.join(targetDir, backendProjectName);
    
    if (fs.existsSync(oldBackendDir)) {
        // 只有当项目名称不同时才重命名目录
        if (backendProjectName !== 'PluginBackend') {
            fs.moveSync(oldBackendDir, newBackendDir);
        }
        
        const workingDir = backendProjectName !== 'PluginBackend' ? newBackendDir : oldBackendDir;
        
        // 重命名 csproj 文件
        const oldCsprojPath = path.join(workingDir, 'PluginBackend.csproj');
        const newCsprojPath = path.join(workingDir, `${backendProjectName}.csproj`);
        if (fs.existsSync(oldCsprojPath) && backendProjectName !== 'PluginBackend') {
            fs.moveSync(oldCsprojPath, newCsprojPath);
        }
        
        // 重命名入口类文件
        const oldEntryPath = path.join(workingDir, 'ExamplePlugin.cs');
        const newEntryPath = path.join(workingDir, `${entryClassName}.cs`);
        if (fs.existsSync(oldEntryPath) && entryClassName !== 'ExamplePlugin') {
            fs.moveSync(oldEntryPath, newEntryPath);
        }
        
        // 更新入口类内容
        const entryFilePath = entryClassName !== 'ExamplePlugin' ? newEntryPath : oldEntryPath;
        if (fs.existsSync(entryFilePath)) {
            updateFileContent(entryFilePath, {
                'namespace PluginBackend': `namespace ${backendProjectName}`,
                'class ExamplePlugin': `class ${entryClassName}`,
                'public ExamplePlugin': `public ${entryClassName}`,
                '"yt\\.ikp\\.ccxc-engine\\.ExamplePlugin"': `"${pluginName}"`
            });
        }
        
        // 更新 Controllers 文件夹中的命名空间
        const controllersDir = path.join(workingDir, 'Controllers');
        if (fs.existsSync(controllersDir)) {
            const controllerFiles = fs.readdirSync(controllersDir);
            for (const file of controllerFiles) {
                if (file.endsWith('.cs')) {
                    const filePath = path.join(controllersDir, file);
                    updateFileContent(filePath, {
                        'namespace PluginBackend.Controllers': `namespace ${backendProjectName}.Controllers`,
                        'PluginBackend\\.Controllers': `${backendProjectName}.Controllers`,
                        'ExamplePlugin.API': `${entryClassName}.API`
                    });
                }
            }
        }
    }
    
    // 处理前端部分
    if (frontendConfig) {
        const srcDir = path.join(targetDir, 'src');
        const viewsDir = path.join(srcDir, 'views');
        
        // 确保 views 目录存在
        fs.ensureDirSync(viewsDir);
        
        // 创建组件文件
        const componentContent = `<template>
  <div class="plugin-panel">
    <a-card :title="'${frontendConfig.name}'">
      <p>这是您的插件面板内容。请在这里添加您的业务逻辑。</p>
      <a-button type="primary" @click="handleAction">
        示例按钮
      </a-button>
    </a-card>
  </div>
</template>

<script setup>
import { message } from 'ant-design-vue';

const handleAction = () => {
  message.success('按钮被点击了！');
};
</script>

<style scoped>
.plugin-panel {
  padding: 16px;
}
</style>
`;
        
        fs.writeFileSync(
            path.join(viewsDir, `${frontendConfig.component}.vue`),
            componentContent,
            'utf8'
        );
    } else {
        // 如果不需要前端，删除 src 目录
        const srcDir = path.join(targetDir, 'src');
        if (fs.existsSync(srcDir)) {
            fs.removeSync(srcDir);
        }
    }
    
    console.log('\n🎉 项目创建完成！');
    console.log(`📁 项目位置: ${targetDir}`);
    console.log('\n📋 生成的文件：');
    console.log(`   - manifest.json (插件配置)`);
    console.log(`   - ${backendProjectName}/ (后端项目)`);
    console.log(`     - ${entryClassName}.cs (入口类)`);
    console.log(`     - ${backendProjectName}.csproj`);
    if (frontendConfig) {
        console.log(`   - src/views/${frontendConfig.component}.vue (前端组件)`);
    }
    
    console.log('\n🚀 接下来的步骤：');
    console.log(`1. cd ${projectName}`);
    console.log('2. npm install');
    console.log('3. npm run build');
    
    console.log('\n⚠️  重要提醒：');
    console.log('1. 请在 manifest.json 中修改 icon 字段为合适的 Ant Design 图标名称');
    console.log('2. 前端组件的 icon 也需要修改为合适的图标名称');
    console.log('3. 请根据需要完善入口类和控制器的具体实现');
    
    rl.close();
}

main().catch(console.error); 