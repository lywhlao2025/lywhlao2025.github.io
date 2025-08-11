# 数学运算训练游戏

一个基于Web的数学运算训练游戏，支持加法、减法、乘法和除法运算，包含多种难度级别和时间限制。

## 功能特点

- 支持四种运算类型：加法、减法、乘法、除法
- 可选择不同难度级别：进位/不进位（加法、乘法）或退位/不退位（减法、除法）
- 可设置题目范围：10、50、100或自定义
- 可设置游戏时间：1分钟、2分钟、3分钟、5分钟或自定义
- A/B/C选项答题模式
- 实时计分和统计
- 音效反馈

## 文件结构

```
.
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── game.js         # 游戏逻辑
├── assets/             # 资源文件
│   ├── *.png           # 图片资源
│   └── *.mp3           # 音频资源
└── README.md           # 说明文档
```

## 部署到阿里云

### 方法一：使用阿里云ECS服务器

1. **购买ECS实例**
   - 登录阿里云控制台
   - 选择云服务器ECS
   - 创建实例（推荐选择Ubuntu或CentOS系统）

2. **连接到ECS服务器**
   ```bash
   ssh root@your_server_ip
   ```

3. **安装Web服务器**
   ```bash
   # Ubuntu/Debian系统
   sudo apt update
   sudo apt install nginx
   
   # CentOS系统
   sudo yum install nginx
   ```

4. **启动Nginx服务**
   ```bash
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

5. **上传游戏文件**
   ```bash
   # 在本地机器上执行
   scp -r /Users/laojiaqi/game/mole/* root@your_server_ip:/var/www/html/
   ```

6. **设置文件权限**
   ```bash
   # 在服务器上执行
   sudo chown -R www-data:www-data /var/www/html/
   sudo chmod -R 755 /var/www/html/
   ```

7. **访问游戏**
   打开浏览器，输入服务器IP地址即可访问游戏

### 方法二：使用阿里云对象存储OSS

1. **创建OSS存储空间**
   - 登录阿里云控制台
   - 选择对象存储OSS
   - 创建Bucket（存储空间）

2. **上传文件**
   - 将游戏文件上传到OSS Bucket中
   - 设置所有文件为公共读权限

3. **配置静态网站托管**
   - 在Bucket设置中开启静态网站托管
   - 设置首页为index.html

4. **访问游戏**
   - 使用OSS提供的访问域名访问游戏

### 方法三：使用阿里云应用引擎SAE

1. **打包应用**
   - 将游戏文件打包成zip格式

2. **部署到SAE**
   - 登录阿里云控制台
   - 选择应用引擎SAE
   - 创建应用并上传zip包

## 本地运行

直接在浏览器中打开 `index.html` 文件即可运行游戏。

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 开发说明

- 样式文件：`css/style.css`
- 游戏逻辑：`js/game.js`
- 资源文件存放在 `assets/` 目录中

## 许可证

MIT License
