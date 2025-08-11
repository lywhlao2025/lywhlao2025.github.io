#!/bin/bash
# 部署数学运算训练游戏到阿里云ECS服务器

# 配置区域
REMOTE_HOST="your_server_ip"  # 请替换为你的阿里云服务器IP
REMOTE_USER="root"            # 服务器用户名
REMOTE_PATH="/var/www/html"   # 服务器上的部署路径

echo "开始部署数学运算训练游戏到阿里云服务器..."

# 检查必要的命令是否存在
if ! command -v scp &> /dev/null; then
    echo "错误: 未找到 scp 命令，请安装 OpenSSH 客户端"
    exit 1
fi

if ! command -v ssh &> /dev/null; then
    echo "错误: 未找到 ssh 命令，请安装 OpenSSH 客户端"
    exit 1
fi

# 检查本地游戏文件是否存在
GAME_DIR="/Users/laojiaqi/game/mole"
if [ ! -d "$GAME_DIR" ]; then
    echo "错误: 未找到游戏目录 $GAME_DIR"
    exit 1
fi

echo "正在上传游戏文件到阿里云服务器..."

# 上传游戏文件到服务器
scp -r "$GAME_DIR"/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    echo "文件上传成功！"
else
    echo "文件上传失败！"
    exit 1
fi

# 设置服务器上的文件权限
echo "正在设置文件权限..."
ssh "$REMOTE_USER@$REMOTE_HOST" "chown -R www-data:www-data $REMOTE_PATH && chmod -R 755 $REMOTE_PATH"

if [ $? -eq 0 ]; then
    echo "文件权限设置成功！"
else
    echo "文件权限设置失败！"
    exit 1
fi

echo ""
echo "部署完成！"
echo "请在浏览器中访问 http://$REMOTE_HOST 访问游戏"
echo ""
echo "注意事项："
echo "1. 请确保服务器上已安装并运行了Nginx或Apache等Web服务器"
echo "2. 请将脚本中的 REMOTE_HOST 变量替换为你的阿里云服务器实际IP地址"
echo "3. 如果使用非root用户，请修改 REMOTE_USER 变量"
echo "4. 如果部署路径不同，请修改 REMOTE_PATH 变量"