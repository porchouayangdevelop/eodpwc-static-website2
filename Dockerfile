FROM node:18-alpine as builder

WORKDIR /app


RUN npm i -g pnpm

COPY package*.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

RUN pnpm build


FROM node:18-alpine as runner
WORKDIR /app

COPY --from=builder /app/.output .output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json


FROM nginx:1.13-alpine

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]

# docker build -t eodpwc-static-website2 .
# docker run -p 3000:3000 eodpwc-static-website2
