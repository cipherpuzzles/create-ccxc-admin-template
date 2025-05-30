import { defineConfig } from "vite"
import vue from '@vitejs/plugin-vue'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import fs from 'fs'
import path from 'path'

function getEntries() {
    // 获取 src/views 目录下的所有 .vue 文件
    const viewsDir = path.resolve(__dirname, 'src/views')
    const entries = {}
    
    // 确保目录存在
    if (!fs.existsSync(viewsDir)) {
        return entries
    }

    // 读取目录下所有文件
    const files = fs.readdirSync(viewsDir)
    
    files.forEach(file => {
        // 只处理 .vue 文件
        if (file.endsWith('.vue')) {
            // 获取文件名(不含扩展名)作为入口名
            const name = path.basename(file, '.vue')
            // 设置入口路径
            entries[name] = path.resolve(viewsDir, file)
        }
    })

    return entries
}

export default defineConfig({
    plugins: [vue(), libInjectCss()],
    build: {
        // 如果设置了环境变量，使用动态输出目录，否则使用默认的 dist
        outDir: process.env.BUILD_OUTPUT_DIR || 'dist',
        cssCodeSplit: true,
        lib: {
            entry: getEntries(),
            name: 'pluginDefault',
            formats: ['umd'],
            fileName: (format, entryName) => `${entryName}.js`
        },
        rollupOptions: {
            external: ['vue', 'ant-design-vue'],
            output: {
                globals: {
                    vue: 'Vue',
                    'ant-design-vue': 'Antd'
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    }
})