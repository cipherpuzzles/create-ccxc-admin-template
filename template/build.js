import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 清空目录函数
function clearDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        console.log(`清空目录: ${dirPath}`)
        fs.rmSync(dirPath, { recursive: true, force: true })
    }
}

// 读取manifest.json
function readManifest() {
    const manifestPath = path.join(__dirname, 'manifest.json')
    if (!fs.existsSync(manifestPath)) {
        throw new Error('manifest.json 文件不存在')
    }
    
    const manifestContent = fs.readFileSync(manifestPath, 'utf-8')
    const manifest = JSON.parse(manifestContent)
    return { manifest, manifestPath }
}

// 查找.csproj文件
function findCsprojFile() {
    const subdirs = fs.readdirSync(__dirname, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    
    for (const subdir of subdirs) {
        const subdirPath = path.join(__dirname, subdir)
        const files = fs.readdirSync(subdirPath)
        const csproj = files.find(file => file.endsWith('.csproj'))
        
        if (csproj) {
            return { csprojDir: subdirPath, csprojFile: csproj }
        }
    }
    
    return { csprojDir: null, csprojFile: null }
}

// 构建后端
async function buildBackend(projectName, manifestPath) {
    console.log('正在构建后端项目...')
    
    const { csprojDir, csprojFile } = findCsprojFile()
    
    if (!csprojDir || !csprojFile) {
        console.log('未找到 .csproj 文件，跳过后端构建')
        return
    }
    
    console.log(`找到 .csproj 文件: ${path.join(csprojDir, csprojFile)}`)
    
    // 确保输出目录存在
    const backendOutputDir = path.join(__dirname, 'dist', 'backend', projectName)
    fs.mkdirSync(backendOutputDir, { recursive: true })
    
    // 切换到 .csproj 所在目录并执行 dotnet build
    const dotnetBuildCommand = `dotnet build -c Release -o "../dist/backend/${projectName}"`
    
    try {
        execSync(dotnetBuildCommand, { 
            cwd: csprojDir, 
            stdio: 'inherit' 
        })
        console.log('后端构建完成')
    } catch (error) {
        console.error('后端构建失败:', error.message)
        throw error
    }
    
    // 将 manifest.json 复制到后端输出目录
    const manifestTargetPath = path.join(backendOutputDir, 'manifest.json')
    fs.copyFileSync(manifestPath, manifestTargetPath)
    console.log('manifest.json 已复制到后端输出目录')
}

// 构建前端
async function buildFrontend(projectName) {
    console.log('正在构建前端项目...')
    
    // 确保前端输出目录存在
    const frontendOutputDir = path.join(__dirname, 'dist', 'frontend', projectName)
    fs.mkdirSync(frontendOutputDir, { recursive: true })
    
    // 设置环境变量用于 vite 配置
    process.env.BUILD_OUTPUT_DIR = frontendOutputDir
    process.env.PROJECT_NAME = projectName
    
    try {
        execSync('npx vite build', { 
            cwd: __dirname, 
            stdio: 'inherit' 
        })
        console.log('前端构建完成')
    } catch (error) {
        console.error('前端构建失败:', error.message)
        throw error
    }
}

async function build() {
    try {
        // 获取命令行参数
        const args = process.argv.slice(2)
        const buildType = args[0] // 'frontend', 'backend', 或 undefined (全部构建)
        
        console.log('开始构建过程...')
        
        // 读取 manifest.json
        const { manifest, manifestPath } = readManifest()
        const projectName = manifest.name
        console.log(`项目名称: ${projectName}`)
        
        // 根据构建类型清空相应目录
        const distPath = path.join(__dirname, 'dist')
        
        if (!buildType) {
            // 全部构建，清空整个dist目录
            clearDirectory(distPath)
        } else if (buildType === 'frontend') {
            // 仅构建前端，清空前端目录
            const frontendDistPath = path.join(distPath, 'frontend', projectName)
            clearDirectory(frontendDistPath)
        } else if (buildType === 'backend') {
            // 仅构建后端，清空后端目录
            const backendDistPath = path.join(distPath, 'backend', projectName)
            clearDirectory(backendDistPath)
        }
        
        // 根据参数决定构建什么
        if (!buildType || buildType === 'backend') {
            await buildBackend(projectName, manifestPath)
        }
        
        if (!buildType || buildType === 'frontend') {
            await buildFrontend(projectName)
        }
        
        console.log('构建过程完成！')
        
        if (!buildType) {
            console.log(`后端输出目录: dist/backend/${projectName}`)
            console.log(`前端输出目录: dist/frontend/${projectName}`)
        } else if (buildType === 'backend') {
            console.log(`后端输出目录: dist/backend/${projectName}`)
        } else if (buildType === 'frontend') {
            console.log(`前端输出目录: dist/frontend/${projectName}`)
        }
        
    } catch (error) {
        console.error('构建失败:', error.message)
        process.exit(1)
    }
}

build() 