FROM node:18-alpine as builder

WORKDIR /app

COPY package.json ./

RUN npm install

FROM nginx:alpine

COPY --from=builder /app/node_modules /usr/share/nginx/html/node_modules
COPY ./public /usr/share/nginx/html

RUN chmod -R 755 /usr/share/nginx/html && \
    chown -R nginx:nginx /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]