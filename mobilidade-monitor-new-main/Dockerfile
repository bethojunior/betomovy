# => Build container
FROM node:20.5-alpine3.17 AS builder
ENV GENERATE_SOURCEMAP=false
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prd-build

# => Run container
FROM nginx:1.24.0-alpine

# Nginx config
RUN rm -rf /etc/nginx/conf.d
COPY docker/nginx /etc/nginx

# Static build
COPY --from=builder /app/dist /usr/share/nginx/html/

# Default port exposure
EXPOSE 80

# Copy .env file and shell script to container
WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env.build ./.env

# Make our shell script executable
RUN chmod +x env.sh

# Start Nginx server
CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]