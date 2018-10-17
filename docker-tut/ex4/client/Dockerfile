FROM node:10

COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=0 build/ /usr/share/nginx/html
COPY nginx/config/ /etc/nginx