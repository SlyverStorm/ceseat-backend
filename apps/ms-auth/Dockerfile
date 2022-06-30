FROM node:16

RUN npm i -g pnpm && pnpm config set auto-install-peers true

ADD ./ /src
WORKDIR /src

RUN rm -rf /src/node_modules /src/build
RUN pnpm i 
RUN npx prisma generate
RUN pnpm build

ENTRYPOINT ["/bin/bash", "run.sh"]
# CMD  ["ls"]
EXPOSE 3000