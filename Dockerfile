FROM node:21
WORKDIR /usr/src/poster_app
COPY package.json yarn.lock ./
##RUN yarn install
COPY . .