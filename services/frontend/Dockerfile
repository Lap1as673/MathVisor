# Этап сборки
FROM node:18-alpine as builder

WORKDIR /app

# Копируем package.json
COPY package.json ./

# Устанавливаем зависимости
RUN npm install

# Этап production
FROM nginx:alpine

# Копируем статические файлы
COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules
COPY ./public /usr/share/nginx/html

# ИСПРАВЛЕНИЕ: Даем правильные права
RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

# Копируем конфигурацию nginx
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Проверяем конфигурацию
# RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]