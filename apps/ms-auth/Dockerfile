FROM node:14

ADD package.json /tmp/package.json
ADD prisma/schema.prisma /tmp/prisma/schema.prisma

RUN rm -rf build
RUN cd /tmp && npm i -g pnpm 
RUN npm install -g prisma
RUN pnpm config set auto-install-peers true 
RUN cd /tmp && pnpm i 

ADD ./ /src
RUN rm -rf src/node_modules && cp -a /tmp/node_modules /src/

WORKDIR /src

RUN npx prisma generate
RUN pnpm build

CMD ["node", "build/src/app.js"]
EXPOSE 3000




# FROM node:14 as base

# WORKDIR /home/node/app

# COPY package*.json ./

# RUN npm i -g pnpm
# RUN pnpm config set auto-install-peers true
# RUN pnpm i
# RUN pnpm build

# CMD ["node", "/home/node/app/build/src/app.js"]
# EXPOSE 3000
# #docker build -t test-ms .