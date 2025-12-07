# frontend/Dockerfile

# 1) build stage
FROM node:20-alpine AS build
WORKDIR /app

COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY frontend ./
RUN yarn build

# 2) nginx production
FROM nginx:stable-alpine

# hapus default html
RUN rm -rf /usr/share/nginx/html/*

# copy hasil build
COPY --from=build /app/build /usr/share/nginx/html

# copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
