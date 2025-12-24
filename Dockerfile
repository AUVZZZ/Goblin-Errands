# 第一阶段：构建环境
FROM node:18-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制依赖描述文件
COPY package.json ./

# 安装依赖
RUN npm install

# 复制所有源代码
COPY . .

# 执行构建（生成 dist 目录）
RUN npm run build

# 第二阶段：运行环境 (Nginx)
FROM nginx:alpine

# 从第一阶段复制构建好的文件到 Nginx 目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
