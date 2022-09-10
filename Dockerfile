FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY . .

RUN npm ci
RUN npm run build

FROM node:16-alpine

COPY --from=builder /usr/src/app/dist /srv/app
COPY --from=builder /usr/src/app/node_modules /srv/node_modules

# Node Server shouldn't bind to localhost in docker
ENV SERVER_HOST=0.0.0.0

CMD ["node", "/srv/app/index.js"]
