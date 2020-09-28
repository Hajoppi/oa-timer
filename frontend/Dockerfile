FROM node:latest as build_stage
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:stable-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build_stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]