FROM nginx:alpine

# Установка дополнительных утилит (опционально)
RUN apk add --no-cache curl vim

# Копирование конфигов
COPY nginx.conf /etc/nginx/nginx.conf
COPY conf.d/ /etc/nginx/conf.d/
COPY includes/ /etc/nginx/includes/

# Создание директорий для логов
RUN mkdir -p /var/log/nginx && \
    mkdir -p /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /var/cache/nginx

# Проверка конфига
RUN nginx -t

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
