FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm run build

FROM node:16-alpine

COPY --from=builder /usr/src/app/dist /app

EXPOSE 80

CMD ["node", "/app/index.js"]
