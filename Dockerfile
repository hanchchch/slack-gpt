FROM node:18-alpine

WORKDIR /usr/src/app

COPY *.json .
COPY *.lock .
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

ENTRYPOINT [ "yarn", "start:prod" ]