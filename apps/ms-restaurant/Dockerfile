FROM node:16

RUN npm i -g pnpm && pnpm config set auto-install-peers true

ADD ./ /src
WORKDIR /src

RUN rm -rf /src/node_modules /src/build
RUN pnpm i && pnpm build

CMD ["node", "build/src/app.js"]
EXPOSE 3000