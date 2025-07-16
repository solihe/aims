# AIMS启动脚本 - PowerShell版本
param(
    [string]$Action = "start"
)

# 设置控制台编码为UTF-8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Write-Host ""
Write-Host "     ╔═══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "     ║                                                           ║" -ForegroundColor Cyan
Write-Host "     ║     █████╗ ██╗███╗   ███╗███████╗                        ║" -ForegroundColor Cyan
Write-Host "     ║    ██╔══██╗██║████╗ ████║██╔════╝                        ║" -ForegroundColor Cyan
Write-Host "     ║    ███████║██║██╔████╔██║███████╗                        ║" -ForegroundColor Cyan
Write-Host "     ║    ██╔══██║██║██║╚██╔╝██║╚════██║                        ║" -ForegroundColor Cyan
Write-Host "     ║    ██║  ██║██║██║ ╚═╝ ██║███████║                        ║" -ForegroundColor Cyan
Write-Host "     ║    ╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚══════╝                        ║" -ForegroundColor Cyan
Write-Host "     ║                                                           ║" -ForegroundColor Cyan
Write-Host "     ║           AI内容营销系统 - PowerShell启动脚本              ║" -ForegroundColor Cyan
Write-Host "     ║                                                           ║" -ForegroundColor Cyan
Write-Host "     ╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 检查Docker
Write-Host "🔍 检查Docker环境..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker环境正常: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker未安装或未启动，请先安装并启动Docker Desktop" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 创建必要目录
Write-Host ""
Write-Host "📁 创建必要目录..." -ForegroundColor Yellow
$directories = @("logs", "uploads", "data", "data\postgres", "data\redis", "scripts")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   创建目录: $dir" -ForegroundColor Gray
    }
}

# 检查配置文件
Write-Host ""
Write-Host "⚙️ 检查配置文件..." -ForegroundColor Yellow
if (!(Test-Path ".env")) {
    Write-Host "📝 创建默认环境配置文件..." -ForegroundColor Gray
    @"
NODE_ENV=development
API_PORT=3001
FRONTEND_PORT=3000
CORS_ORIGIN=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

# 检查package.json
if (!(Test-Path "package.json")) {
    Write-Host "❌ 未找到package.json，这似乎不是一个Node.js项目目录" -ForegroundColor Red
    Write-Host "请确保您在正确的项目根目录中运行此脚本" -ForegroundColor Yellow
    Read-Host "按任意键退出"
    exit 1
}

switch ($Action.ToLower()) {
    "start" {
        Write-Host ""
        Write-Host "🚀 启动开发服务器..." -ForegroundColor Yellow
        
        # 安装依赖
        Write-Host "📦 安装依赖包..." -ForegroundColor Gray
        npm install
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 依赖安装失败" -ForegroundColor Red
            Read-Host "按任意键退出"
            exit 1
        }
        
        # 启动开发服务器
        Write-Host "🎯 启动Vite开发服务器..." -ForegroundColor Gray
        Write-Host ""
        Write-Host "✅ 准备完成！正在启动..." -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 访问地址：" -ForegroundColor Cyan
        Write-Host "   主应用: http://localhost:5173" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 提示：按 Ctrl+C 停止服务" -ForegroundColor Yellow
        Write-Host ""
        
        npm run dev
    }
    
    "build" {
        Write-Host "🏗️ 构建生产版本..." -ForegroundColor Yellow
        npm run build
    }
    
    "status" {
        Write-Host "📊 检查服务状态..." -ForegroundColor Yellow
        Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*vite*"}
    }
    
    default {
        Write-Host "用法: .\start-aims.ps1 [start|build|status]" -ForegroundColor Yellow
    }
}