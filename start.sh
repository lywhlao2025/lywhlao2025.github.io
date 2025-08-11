#!/bin/bash
# 启动本地服务器测试游戏

echo "正在启动本地服务器..."
echo "请在浏览器中打开 http://localhost:8000 访问游戏"

# 检查系统类型
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS系统
    cd /Users/laojiaqi/game/mole && python3 -m http.server 8000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux系统
    cd /Users/laojiaqi/game/mole && python3 -m http.server 8000
else
    # Windows系统 (Git Bash)
    cd /Users/laojiaqi/game/mole && python -m http.server 8000
fi