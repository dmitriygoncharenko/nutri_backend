FROM node:lts-alpine

ENV NODE_ENV production

USER root
WORKDIR /home/node

COPY package*.json ./
RUN npm ci

COPY --chown=node:node . .
RUN npm run build \
    && npm prune --production

CMD ["node", "dist/src/main.js"]