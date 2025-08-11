#!/bin/bash
# 测试数学运算训练游戏功能

echo "数学运算训练游戏功能测试"
echo "========================"

# 检查必要文件是否存在
echo "1. 检查必要文件..."
FILES=(
    "/Users/laojiaqi/game/mole/index.html"
    "/Users/laojiaqi/game/mole/css/style.css"
    "/Users/laojiaqi/game/mole/js/game.js"
)

MISSING_FILES=0
for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✓ $file"
    else
        echo "   ✗ $file (缺失)"
        MISSING_FILES=1
    fi
done

if [ $MISSING_FILES -eq 1 ]; then
    echo "   错误: 缺少必要文件，无法进行测试"
    exit 1
fi

# 检查资源文件
echo ""
echo "2. 检查资源文件..."
ASSETS_DIR="/Users/laojiaqi/game/mole/assets"
if [ -d "$ASSETS_DIR" ]; then
    echo "   ✓ 资源目录存在"
    ASSET_COUNT=$(ls -1 "$ASSETS_DIR" 2>/dev/null | wc -l)
    if [ "$ASSET_COUNT" -gt 0 ]; then
        echo "   ✓ 发现 $ASSET_COUNT 个资源文件"
    else
        echo "   ! 资源目录为空"
    fi
else
    echo "   ! 资源目录不存在"
fi

# 检查关键功能函数
echo ""
echo "3. 检查关键功能函数..."
GAME_JS="/Users/laojiaqi/game/mole/js/game.js"

FUNCTIONS=(
    "generateQuestion"
    "startGame"
    "selectOption"
    "checkDifficulty"
)

MISSING_FUNCTIONS=0
for func in "${FUNCTIONS[@]}"; do
    if grep -q "function $func" "$GAME_JS"; then
        echo "   ✓ $func"
    else
        echo "   ✗ $func (未找到)"
        MISSING_FUNCTIONS=1
    fi
done

if [ $MISSING_FUNCTIONS -eq 0 ]; then
    echo "   所有关键功能函数都已实现"
else
    echo "   警告: 缺少部分关键功能函数"
fi

# 检查HTML元素
echo ""
echo "4. 检查HTML元素..."
INDEX_HTML="/Users/laojiaqi/game/mole/index.html"

ELEMENTS=(
    "id=\"question\""
    "id=\"optionsContainer\""
    "id=\"startBtn\""
    "id=\"timeLeft\""
    "id=\"currentScore\""
)

MISSING_ELEMENTS=0
for element in "${ELEMENTS[@]}"; do
    if grep -q "$element" "$INDEX_HTML"; then
        echo "   ✓ $element"
    else
        echo "   ✗ $element (未找到)"
        MISSING_ELEMENTS=1
    fi
done

if [ $MISSING_ELEMENTS -eq 0 ]; then
    echo "   所有关键HTML元素都已包含"
else
    echo "   警告: 缺少部分关键HTML元素"
fi

echo ""
echo "测试完成！"
echo "建议: 运行 ./start.sh 启动本地服务器进行实际测试"