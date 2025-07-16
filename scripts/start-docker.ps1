# AIMS Docker启动脚本 - PowerShell版本
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
Write-Host "     ║           AI内容营销系统 - Docker启动脚本                  ║" -ForegroundColor Cyan
Write-Host "     ║                                                           ║" -ForegroundColor Cyan
Write-Host "     ╚═══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 检查Docker
Write-Host "🔍 检查Docker环境..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker未安装或未启动，请先启动Docker Desktop" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

try {
    $composeVersion = docker-compose --version
    Write-Host "✅ Docker Compose: $composeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose未安装" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 创建必要目录
Write-Host ""
Write-Host "📁 创建必要目录..." -ForegroundColor Yellow
$directories = @("data", "data/postgres", "data/redis", "logs", "uploads")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   创建目录: $dir" -ForegroundColor Gray
    }
}

switch ($Action.ToLower()) {
    "start" {
        Write-Host ""
        Write-Host "🛑 停止现有容器..." -ForegroundColor Yellow
        docker-compose down
        
        Write-Host ""
        Write-Host "🏗️ 构建Docker镜像..." -ForegroundColor Yellow
        docker-compose build --no-cache
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 镜像构建失败" -ForegroundColor Red
            Read-Host "按任意键退出"
            exit 1
        }
        
        Write-Host ""
        Write-Host "🚀 启动所有服务..." -ForegroundColor Yellow
        docker-compose up -d
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ 服务启动失败" -ForegroundColor Red
            Write-Host "查看日志: docker-compose logs" -ForegroundColor Yellow
            Read-Host "按任意键退出"
            exit 1
        }
        
        Write-Host ""
        Write-Host "⏳ 等待服务启动..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        
        Write-Host ""
        Write-Host "✅ 系统启动成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "📱 访问地址：" -ForegroundColor Cyan
        Write-Host "   主应用:     http://localhost" -ForegroundColor White
        Write-Host "   前端:       http://localhost:3000" -ForegroundColor White
        Write-Host "   后端API:    http://localhost:3001" -ForegroundColor White
        Write-Host "   数据库管理: http://localhost:8080" -ForegroundColor White
        Write-Host ""
        Write-Host "📊 服务状态：" -ForegroundColor Cyan
        docker-compose ps
    }
    
    "stop" {
        Write-Host "🛑 停止所有服务..." -ForegroundColor Yellow
        docker-compose down
    }
    
    "restart" {
        Write-Host "🔄 重启所有服务..." -ForegroundColor Yellow
        docker-compose restart
    }
    
    "status" {
        Write-Host "📊 服务状态：" -ForegroundColor Yellow
        docker-compose ps
    }
    
    "logs" {
        Write-Host "📋 查看日志：" -ForegroundColor Yellow
        docker-compose logs -f
    }
    
    default {
        Write-Host "用法: .\scripts\start-docker.ps1 [start|stop|restart|status|logs]" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "💡 常用命令：" -ForegroundColor Yellow
Write-Host "   查看状态: .\scripts\start-docker.ps1 status" -ForegroundColor Gray
Write-Host "   查看日志: .\scripts\start-docker.ps1 logs" -ForegroundColor Gray
Write-Host "   停止服务: .\scripts\start-docker.ps1 stop" -ForegroundColor Gray
Write-Host "   重启服务: .\scripts\start-docker.ps1 restart" -ForegroundColor Gray